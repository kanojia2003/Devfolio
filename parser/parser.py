import fitz  # PyMuPDF
import re

# ---------------------------------------------
# 1. Extract raw text from resume PDF
# ---------------------------------------------
def extract_resume_text(pdf_path):
    text = ""
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

# ---------------------------------------------
# 2. Section Definitions & Helpers
# ---------------------------------------------
SECTION_HEADERS = [
    "education", "experience", "skills", "projects",
    "certifications", "achievements", "awards", "languages",
    "additional information", "computer proficiency",
    "core competencies", "internships", "co-curricular",
    "declaration", "others"
]

CORE_SECTIONS = ["education", "experience", "skills"]
OTHER_SECTIONS = [s for s in SECTION_HEADERS if s not in CORE_SECTIONS]

def split_into_sections(text):
    normalized_text = "\n" + text.upper()
    pattern = r"\n(" + "|".join([sh.upper() for sh in SECTION_HEADERS]) + r")\n"
    parts = re.split(pattern, normalized_text)

    sections = {}
    current_section = None

    for part in parts:
        part = part.strip()
        if part.lower() in SECTION_HEADERS:
            current_section = part.lower()
            sections[current_section] = ""
        elif current_section:
            sections[current_section] += part + "\n"
    return sections

# ---------------------------------------------
# 3. Name Heuristic
# ---------------------------------------------
def is_probable_name(line):
    if any(char.isdigit() for char in line):
        return False
    words = line.strip().split()
    return 1 < len(words) <= 4 and all(word[0].isupper() for word in words if word)

# ---------------------------------------------
# 4. Parse All Resume Fields
# ---------------------------------------------
def parse_resume_data(text):
    data = {}

    # -------- Extract Basic Info --------
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    lines = lines[:15]
    blocklist = SECTION_HEADERS + ["linkedin", "github", "phone", "email"]
    filtered = [line for line in lines if all(bl not in line.lower() for bl in blocklist)]
    name = next((line for line in filtered if is_probable_name(line)), "")
    data['name'] = name

    # -------- Extract Regex Fields --------
    data['email'] = re.search(r'[\w\.-]+@[\w\.-]+', text).group(0) if re.search(r'[\w\.-]+@[\w\.-]+', text) else ""
    data['phone'] = re.search(r'(\+91[\s-]?)?\d{10}', text).group(0) if re.search(r'(\+91[\s-]?)?\d{10}', text) else ""
    data['linkedin'] = re.search(r'(https?://)?(www\.)?linkedin\.com/in/[^\s]+', text).group(0) if re.search(r'(https?://)?(www\.)?linkedin\.com/in/[^\s]+', text) else ""
    data['github'] = re.search(r'(https?://)?(www\.)?github\.com/[^\s]+', text).group(0) if re.search(r'(https?://)?(www\.)?github\.com/[^\s]+', text) else ""

    # -------- Extract Structured Sections --------
    sections = split_into_sections(text)

    # Education
    data['education'] = sections.get("education", "").strip()

    # Experience
    data['experience'] = sections.get("experience", "").strip()

    # -------- Filter & Clean Skills --------
    raw_skills = sections.get("skills", "")
    split_skills = re.split(r"[•\n,-]", raw_skills)

    # Blacklist patterns to exclude from skills
    blacklist_keywords = [
        "achievement", "award", "certificate", "loyalty", "top performer",
        "appreciation", "sbi", "ebix", "", "", "", "", "language", "additional", "miscellaneous"
    ]

    valid_skills = []
    other_fragments = []

    for item in split_skills:
        item = item.strip()
        if not item:
            continue

        if any(bad in item.lower() for bad in blacklist_keywords) or len(item) > 60 or not re.search(r'[a-zA-Z]', item):
            other_fragments.append(item)
        else:
            valid_skills.append(item)

    data['skills'] = valid_skills

    # -------- Extract Other Sections + Orphan Fragments --------
    others = []
    for key in OTHER_SECTIONS:
        content = sections.get(key, "").strip()
        if content:
            others.append(f"**{key.capitalize()}**:\n{content}")

    if other_fragments:
        others.append(f"**Miscellaneous from Skills**:\n" + "\n".join(other_fragments))

    data['others'] = "\n\n".join(others)

    return data
