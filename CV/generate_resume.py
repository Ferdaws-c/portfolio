from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "Ferdaws_Qaem_Resume.pdf"

NAVY = colors.HexColor("#0B1F33")
BLUE = colors.HexColor("#1769AA")
TEAL = colors.HexColor("#087F73")
TEXT = colors.HexColor("#1C2733")
MUTED = colors.HexColor("#526271")
RULE = colors.HexColor("#D8E1EA")
PALE = colors.HexColor("#EEF5FA")


def register_fonts():
    font_dir = Path("C:/Windows/Fonts")
    pdfmetrics.registerFont(TTFont("Resume", str(font_dir / "segoeui.ttf")))
    pdfmetrics.registerFont(TTFont("Resume-Semibold", str(font_dir / "seguisb.ttf")))
    pdfmetrics.registerFont(TTFont("Resume-Bold", str(font_dir / "segoeuib.ttf")))
    pdfmetrics.registerFontFamily(
        "Resume",
        normal="Resume",
        bold="Resume-Bold",
        italic="Resume",
        boldItalic="Resume-Bold",
    )


register_fonts()
styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "Name", parent=styles["Normal"], fontName="Resume-Bold", fontSize=27,
    leading=30, textColor=NAVY, spaceAfter=4,
)
role_style = ParagraphStyle(
    "Role", parent=styles["Normal"], fontName="Resume-Semibold", fontSize=11.2,
    leading=14, textColor=TEXT, spaceAfter=5,
)
contact_style = ParagraphStyle(
    "Contact", parent=styles["Normal"], fontName="Resume", fontSize=8.3,
    leading=11, textColor=MUTED,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Normal"], fontName="Resume-Bold", fontSize=9.4,
    leading=12, textColor=BLUE, spaceBefore=9, spaceAfter=5,
    uppercase=True,
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"], fontName="Resume", fontSize=9.2,
    leading=12.25, textColor=TEXT, spaceAfter=3,
)
small_style = ParagraphStyle(
    "Small", parent=body_style, fontSize=8.4, leading=11.1, textColor=MUTED,
)
entry_title_style = ParagraphStyle(
    "EntryTitle", parent=styles["Normal"], fontName="Resume-Bold", fontSize=10.2,
    leading=12.5, textColor=NAVY,
)
entry_subtitle_style = ParagraphStyle(
    "EntrySubtitle", parent=styles["Normal"], fontName="Resume-Semibold", fontSize=8.8,
    leading=11.5, textColor=TEAL, spaceAfter=2,
)
date_style = ParagraphStyle(
    "Date", parent=styles["Normal"], fontName="Resume-Semibold", fontSize=8.3,
    leading=11, textColor=MUTED, alignment=TA_RIGHT,
)
bullet_style = ParagraphStyle(
    "Bullet", parent=body_style, leftIndent=11, firstLineIndent=-7,
    bulletIndent=0, spaceAfter=1.5,
)
skill_label_style = ParagraphStyle(
    "SkillLabel", parent=styles["Normal"], fontName="Resume-Bold", fontSize=8.7,
    leading=11.2, textColor=NAVY,
)
skill_value_style = ParagraphStyle(
    "SkillValue", parent=styles["Normal"], fontName="Resume", fontSize=8.7,
    leading=11.2, textColor=TEXT,
)


def section_heading(text):
    return [Spacer(1, 2), Paragraph(text.upper(), section_style),
            Table([[""]], colWidths=[7.38 * inch], rowHeights=[0.6],
                  style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), RULE)]))]


def entry_header(title, date, subtitle=None):
    left = [Paragraph(title, entry_title_style)]
    if subtitle:
        left.append(Paragraph(subtitle, entry_subtitle_style))
    table = Table(
        [[left, Paragraph(date, date_style)]],
        colWidths=[5.75 * inch, 1.63 * inch],
        hAlign="LEFT",
        style=TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
        ]),
    )
    return table


def bullets(items):
    return [Paragraph(item, bullet_style, bulletText="•") for item in items]


def project(title, stack, url, bullets_list):
    linked_title = f'<link href="{url}" color="#0B1F33"><b>{title}</b></link>'
    block = [entry_header(linked_title, stack)]
    block.extend(bullets(bullets_list))
    block.append(Spacer(1, 4))
    return KeepTogether(block)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin, 0.43 * inch, letter[0] - doc.rightMargin, 0.43 * inch)
    canvas.setFont("Resume", 7.2)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 0.25 * inch, "Ferdaws Qaem  |  ferdaws-c.github.io/portfolio")
    canvas.drawRightString(letter[0] - doc.rightMargin, 0.25 * inch, f"Page {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUTPUT),
    pagesize=letter,
    leftMargin=0.56 * inch,
    rightMargin=0.56 * inch,
    topMargin=0.48 * inch,
    bottomMargin=0.55 * inch,
    title="Ferdaws Qaem Resume",
    author="Ferdaws Qaem",
    subject="Computer Engineering, AI and Software Engineering Resume",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="resume-frame", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
doc.addPageTemplates([PageTemplate(id="resume", frames=[frame], onPage=footer)])

story = []
story.append(Paragraph("Ferdaws Qaem", name_style))
story.append(Paragraph("Computer Engineering Student | AI and Software Engineering", role_style))
story.append(Paragraph(
    'Istanbul, Türkiye &nbsp;·&nbsp; +90 534 358 66 03 &nbsp;·&nbsp; '
    '<link href="mailto:ferdawsqaem@gmail.com" color="#1769AA">ferdawsqaem@gmail.com</link> &nbsp;·&nbsp; '
    '<link href="https://linkedin.com/in/ferdaws-qaem" color="#1769AA">LinkedIn</link> &nbsp;·&nbsp; '
    '<link href="https://github.com/Ferdaws-c" color="#1769AA">GitHub</link> &nbsp;·&nbsp; '
    '<link href="https://ferdaws-c.github.io/portfolio/" color="#1769AA">Portfolio</link>',
    contact_style,
))
story.append(Spacer(1, 7))
story.append(Paragraph(
    "Fourth-year Computer Engineering student with hands-on experience building local AI applications, cross-platform mobile products, and embedded IoT systems. Completed Microsoft's AI Innovators Internship Program and an Erasmus+ exchange at VSB-Technical University of Ostrava. Strong foundation in Python, C/C++, Dart, object-oriented design, data structures, and algorithms.",
    body_style,
))

story.extend(section_heading("Experience"))
story.append(entry_header(
    "AI Innovators Internship Program - Participant",
    "Summer 2026 | Remote",
    "Microsoft Turkey",
))
story.extend(bullets([
    "Built an end-to-end Retrieval-Augmented Generation (RAG) assistant with Python, local LLMs, and Microsoft Foundry Local for cloud-independent document question answering.",
    "Implemented document ingestion, indexing, contextual retrieval, prompt design, and local model orchestration in a privacy-first AI pipeline.",
    "Completed the program capstone and received the Microsoft AI Innovators Internship Program certificate of completion.",
]))

story.extend(section_heading("Certifications"))
cert_table = Table([
    [Paragraph("<b>AI Innovators Internship Program</b><br/><font color='#526271'>Microsoft Turkey</font>", body_style), Paragraph("17 Aug 2026", date_style)],
    [Paragraph("<b>Fundamentals of Agents - Unit 1</b><br/><font color='#526271'>Hugging Face Agents Course</font>", body_style), Paragraph("29 Aug 2026", date_style)],
], colWidths=[5.75 * inch, 1.63 * inch])
cert_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LINEBELOW", (0, 0), (-1, 0), 0.35, RULE),
]))
story.append(cert_table)

story.extend(section_heading("Education"))
story.append(entry_header("B.Sc. Computer Engineering", "09/2023 - Expected 07/2027", "Istanbul Kültür University | Istanbul, Türkiye | GPA: 3.04/4.00"))
story.append(Paragraph("Relevant coursework: Data Structures and Algorithms, Object-Oriented Programming, Operating Systems, Computer Networks, Machine Learning, Embedded Systems and IoT, Mobile Programming, Project Management.", small_style))
story.append(Spacer(1, 4))
story.append(entry_header("Erasmus+ Exchange", "09/2025 - 01/2026", "VSB-Technical University of Ostrava | Czech Republic"))
story.append(Paragraph("Faculty of Electrical Engineering and Computer Science. International academic experience in a cross-cultural engineering environment.", small_style))

story.extend(section_heading("Technical Skills"))
skills = [
    ("Languages", "Python, C, C++, Dart, GDScript"),
    ("AI and Data", "RAG, local LLMs, Microsoft Foundry Local, prompt design, machine learning fundamentals"),
    ("Mobile", "Flutter, Dart UI, cross-platform development, widget composition"),
    ("Embedded and IoT", "Sensor integration, real-time polling, alert systems, hardware-software interfacing"),
    ("Engineering", "OOP, data structures and algorithms, event-driven design, Git, GitHub, VS Code"),
]
skill_rows = [[Paragraph(label, skill_label_style), Paragraph(value, skill_value_style)] for label, value in skills]
skill_table = Table(skill_rows, colWidths=[1.25 * inch, 6.13 * inch])
skill_table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
    ("TOPPADDING", (0, 0), (-1, -1), 1.4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 1.4),
]))
story.append(skill_table)
story.append(PageBreak())
story.extend(section_heading("Selected Projects"))
story.append(project(
    "Local RAG AI Assistant",
    "Python | RAG | Foundry Local",
    "https://github.com/Ferdaws-c/local-rag-intelligence-system",
    [
        "Architected a fully local RAG assistant that ingests custom knowledge sources, retrieves relevant context, and generates grounded answers without external cloud AI services.",
        "Connected Microsoft Foundry Local, Python, and local LLMs in a privacy-first application pipeline and delivered the project as the AI Innovators program capstone.",
    ],
))
story.append(project(
    "Campus Lost and Found",
    "Flutter | Dart | Python | OOP",
    "https://github.com/JoeMorningStarr/campus-lost-found-system",
    [
        "Built a cross-platform campus app for reporting lost items and browsing found-item listings with search and filtering.",
        "Owned the backend data model and item lifecycle logic from lost to found to claimed, strengthening state management and API design skills.",
    ],
))
story.append(project(
    "HPC Temperature Alert System",
    "Embedded C | IoT | Supabase",
    "https://github.com/Ferdaws-c/hpc-temperature-alert-system",
    [
        "Designed a real-time monitoring system for high-performance computing environments using dual thermal sensors and configurable alert thresholds.",
        "Added a ring-buffer cache and exponential backoff to maintain reliable behavior during connectivity failures and intermittent backend access.",
    ],
))
story.append(project(
    "Risk Management Interactive Game",
    "Godot | GDScript | PMBOK",
    "https://github.com/Ferdaws-c/Crisis-cabinet",
    [
        "Translated PMBOK risk management concepts into branching decisions and a scoring model that simulates real project trade-offs.",
        "Completed the full development cycle from requirements and game-loop design through implementation, testing, and a working demonstration.",
    ],
))
story.append(project(
    "Algorithms and Data Structures Practice Suite",
    "C | C++ | Problem Solving",
    "https://github.com/Ferdaws-c",
    [
        "Implemented more than 20 algorithm and data-structure exercises covering linked lists, trees, sorting, recursion, and complexity analysis.",
        "Strengthened low-level reasoning in memory management, pointer arithmetic, correctness, and runtime trade-offs.",
    ],
))

story.extend(section_heading("Languages"))
story.append(Paragraph("Persian: Native &nbsp;&nbsp; | &nbsp;&nbsp; English: Professional &nbsp;&nbsp; | &nbsp;&nbsp; Turkish: Intermediate", body_style))
story.append(Spacer(1, 8))
portfolio_box = Table([[Paragraph(
    '<b>More work and demonstrations:</b> <link href="https://ferdaws-c.github.io/portfolio/" color="#1769AA">ferdaws-c.github.io/portfolio</link>',
    body_style,
)]], colWidths=[7.38 * inch])
portfolio_box.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), PALE),
    ("BOX", (0, 0), (-1, -1), 0.6, RULE),
    ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
]))
story.append(portfolio_box)

doc.build(story)
print(OUTPUT)
