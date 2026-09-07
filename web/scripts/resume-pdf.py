"""Generate the concise two-page resume from the site's public content.
Requires reportlab and a Chinese TrueType font; pass --font on other systems.
"""
import argparse
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--font', default='/System/Library/Fonts/STHeiti Light.ttc')
parser.add_argument('--output', default=str(root / 'output/pdf/yuewen-zhang-resume.pdf'))
args = parser.parse_args()
pdfmetrics.registerFont(TTFont('ResumeSans', args.font, subfontIndex=0))
data = json.loads((root / 'lib/content.generated.json').read_text())
p = data['profile']
projects = {x['id']: x for x in data['projects']}
selection = json.loads((root / 'content/resume.json').read_text())
ink = colors.HexColor('#1e281b'); accent = colors.HexColor('#3d6024'); muted = colors.HexColor('#59634f')
styles = {
 'body': ParagraphStyle('body', fontName='ResumeSans', fontSize=9.2, leading=15, textColor=ink, spaceAfter=5, wordWrap='CJK'),
 'small': ParagraphStyle('small', fontName='ResumeSans', fontSize=8, leading=12, textColor=muted, spaceAfter=6, wordWrap='CJK'),
 'title': ParagraphStyle('title', fontName='ResumeSans', fontSize=26, leading=33, textColor=ink, spaceAfter=9),
 'section': ParagraphStyle('section', fontName='ResumeSans', fontSize=13, leading=20, textColor=accent, spaceBefore=12, spaceAfter=8),
 'heading': ParagraphStyle('heading', fontName='ResumeSans', fontSize=10.5, leading=17, textColor=ink, spaceAfter=4, wordWrap='CJK'),
}
def text(value, style='body'):
 return Paragraph(escape(value).replace('\n','<br/>').replace('—','-').replace('→',' / '), styles[style])
def section(value): return text(value, 'section')

def block(project, detailed=False):
 parts = [text(project['title'] + ' | ' + project['status'], 'heading')]
 if not detailed: parts.append(text(project['summary']))
 if project.get('resumeHighlights'):
  for line in project['resumeHighlights']: parts.append(text('• ' + line))
 elif detailed:
  for step in project['steps']:
   parts.append(text('• ' + '；'.join(step['points'][:2]) + '。'))
 else:
  parts.append(text('• ' + '；'.join(project['steps'][0]['points']) + '。'))
 if not detailed: parts.append(text(project['boundary'], 'small'))
 if project['links'] and not detailed:
  link = project['links'][0]
  label = link['url'].replace('https://','')
  if project['category'] == '研究': label='Image and Vision Computing, 154, 105359 (2025)'
  parts.append(Paragraph('<link href="'+escape(link['url'])+'" color="#3d6024">'+escape(label)+'</link>',styles['small']))
 parts.append(Spacer(1, 7))
 return KeepTogether(parts)

story = [text(p['name'] + '  |  ' + p['englishName'], 'title'), text(p['role'] + '  ·  ' + p['email']), text(p['github'], 'small'), section('个人简介'), text(p['resumeSummary']), section('技术栈')]
for group in p['stack']: story.append(text(group['title'] + '（' + group['level'] + '）：' + ' / '.join(group['tags'])))
story += [section('工作经历'), text(p['experience'][0]['org'] + '  |  2024.07 - 2026.06', 'heading'),text(p['experience'][0]['role'])]
for id in selection['workProjects']:
 if id in projects: story.append(block(projects[id], True))
story += [section('教育经历')]
for e in p['experience'][1:]:
 story.append(text(e['org'] + ' | ' + e['period'] + ' | ' + e['role']))
 if e.get('lab'): story.append(text(e['lab'], 'small'))
story += [PageBreak(), text('项目实践与研究', 'title'),text('公开项目与实验记录 · 以各项目说明中的环境和版本为准','small')]
for focus in p.get('focus', []): story.append(text(focus['title'] + '（' + focus['level'] + '）：' + focus['detail'], 'small'))
for id in selection['selectedProjects']:
 if id in projects: story.append(block(projects[id]))

def footer(canvas, doc):
 canvas.saveState(); canvas.setStrokeColor(colors.HexColor('#bdcbb0')); canvas.line(44,40,A4[0]-44,40)
 canvas.setFont('ResumeSans',8); canvas.setFillColor(muted); canvas.drawString(44,26,p['name']+' | '+p['updated']); canvas.drawRightString(A4[0]-44,26,str(doc.page)); canvas.restoreState()
path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
SimpleDocTemplate(str(path), pagesize=A4, rightMargin=44, leftMargin=44, topMargin=38, bottomMargin=52, title=p['name']+' - AI Infra Resume', author=p['englishName']).build(story,onFirstPage=footer,onLaterPages=footer)
print(path)
