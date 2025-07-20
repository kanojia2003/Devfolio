import fitz  # PyMuPDF
import re

def extract_resume_text(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

# Expanded headers for robust section detection
SECTION_HEADERS = {
    "summary": ["summary", "about me", "profile", "objective"],
    "education": ["education", "academic background", "qualifications"],
    "experience": [
        "experience", "work experience", "professional experience", "employment",
        "internships", "work history", "professional background"
    ],
    "projects": ["projects", "personal projects", "academic projects", "project experience"],
    "skills": ["skills", "technical skills", "key skills", "core skills"],
    "certifications": ["certifications", "certificates"],
    "achievements": ["achievements", "awards", "honors"],
    "responsibility": [
        "position of responsibility", "leadership", "roles", "responsibilities", "positions held"
    ],
    "extracurricular": ["extra curricular", "activities", "co-curricular", "interests"],
}

ALL_SECTION_KEYWORDS = [kw for kws in SECTION_HEADERS.values() for kw in (kws if isinstance(kws, list) else [kws])]

def find_section_indices(lines):
    indices = {}
    for i, line in enumerate(lines):
        l = line.lower().strip()
        for section, keywords in SECTION_HEADERS.items():
            for kw in (keywords if isinstance(keywords, list) else [keywords]):
                # Match header at start of line, allow for : or - after header
                if re.match(rf"^{re.escape(kw)}[\s:\-]*$", l):
                    if section not in indices:
                        indices[section] = i
    return indices

def extract_section(lines, indices, section):
    if section not in indices:
        return ""
    start = indices[section] + 1
    next_starts = [idx for idx in indices.values() if idx > indices[section]]
    end = min(next_starts) if next_starts else len(lines)
    section_lines = []
    for line in lines[start:end]:
        l = line.lower().strip()
        # Skip lines that are section headers
        if any(re.match(rf"^{re.escape(kw)}[\s:\-]*$", l) for kw in ALL_SECTION_KEYWORDS):
            continue
        section_lines.append(line)
    return "\n".join(section_lines).strip()

def extract_name(lines):
    # Heuristic: First non-empty line with 2-4 words, all capitalized, no digits
    for line in lines[:10]:
        line = line.strip()
        if not line or any(char.isdigit() for char in line):
            continue
        words = line.split()
        if 1 < len(words) <= 4 and all(w[0].isupper() for w in words if w):
            return line
    return ""

def extract_email(text):
    match = re.search(r'[\w\.-]+@[\w\.-]+', text)
    return match.group(0) if match else ""

def extract_phone(text):
    match = re.search(r'(\+?\d{1,3}[\s-]?)?\d{10}', text)
    return match.group(0) if match else ""

def extract_github(text):
    match = re.search(r'(https?://)?(www\.)?github\.com/[^\s,]+', text)
    return match.group(0) if match else ""

def extract_linkedin(text):
    match = re.search(r'(https?://)?(www\.)?linkedin\.com/in/[^\s,]+', text)
    return match.group(0) if match else ""

def parse_resume_data(text):
    data = {}
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    indices = find_section_indices(lines)

    data['name'] = extract_name(lines)
    data['email'] = extract_email(text)
    data['phone'] = extract_phone(text)
    data['github'] = extract_github(text)
    data['linkedin'] = extract_linkedin(text)

    # Extract main sections
    data['summary'] = extract_section(lines, indices, "summary")
    data['education'] = extract_section(lines, indices, "education")
    data['experience'] = extract_section(lines, indices, "experience")
    data['projects'] = extract_section(lines, indices, "projects")

    # Skills: process as categories and items
    skills_text = extract_section(lines, indices, "skills")
    skills_lines = [s.strip() for s in skills_text.split('\n') if s.strip()]
    filtered_skills = []
    current_category = None
    
    for line in skills_lines:
        l = line.lower()
        # Exclude lines that match responsibility headers
        if any(l.startswith(kw) for kw in SECTION_HEADERS["responsibility"]):
            continue
            
        # Check if line is a category header (contains a colon)
        category_match = re.match(r'^([^:]+)\s*:\s*(.+)$', line)
        
        if category_match:
            # This line has a category format: "Category: skill1, skill2, ..."
            category = category_match.group(1).strip()
            skills_str = category_match.group(2).strip()
            skills = [s.strip() for s in re.split(r'[,;|]', skills_str) if s.strip()]
            
            # Add as a category object
            filtered_skills.append({
                'category': category,
                'items': skills
            })
        elif ':' in line and not re.search(r'https?://', line):  # Avoid matching URLs
            # This might be a category without skills on the same line
            parts = line.split(':', 1)
            category = parts[0].strip()
            current_category = category
            
            # If there are skills after the colon, process them
            if len(parts) > 1 and parts[1].strip():
                skills = [s.strip() for s in re.split(r'[,;|]', parts[1].strip()) if s.strip()]
                filtered_skills.append({
                    'category': category,
                    'items': skills
                })
        else:
            # This is either a standalone skill or belongs to the current category
            if current_category:
                # Check if we already have this category
                category_exists = False
                for skill_item in filtered_skills:
                    if isinstance(skill_item, dict) and skill_item.get('category') == current_category:
                        # Add to existing category
                        skill_item['items'].append(line)
                        category_exists = True
                        break
                        
                if not category_exists:
                    # Create new category
                    filtered_skills.append({
                        'category': current_category,
                        'items': [line]
                    })
            else:
                # Add as standalone skill
                filtered_skills.append(line)
    
    data['skills'] = filtered_skills

    # Others: combine certifications, achievements, responsibility, extracurricular
    other_parts = []
    for key in ["certifications", "achievements", "responsibility", "extracurricular"]:
        section_text = extract_section(lines, indices, key)
        if section_text:
            other_parts.append(f"{key.capitalize()}:\n{section_text}")

    data['others'] = "\n\n".join(other_parts)

    return data