# This script performs analysis on documents under /docs/implicit to retrieve the statistics of implicit dataset along
# with the relationship between ENRE's test cases and PyCG's, and how many test cases are generated by our own.
#
# This script depends on a local copy of PyCG's repository.

IGNORE_LIST = [
  'builtins',
  'dynamic',
  'external',
  'imports',
  'generator',
]

import argparse
import os
import re

parser = argparse.ArgumentParser()
parser.add_argument('pycg_root_path', help='The root path to pycg\'s local repository')
args = parser.parse_args()

enre_statistic = {}

pycg = {}
enre_new = {}

path_snippets = os.path.join(args.pycg_root_path, 'micro-benchmark', 'snippets')
for group in os.listdir(path_snippets):
  pycg[group] = {}
  path_case = os.path.join(path_snippets, group)
  for case in os.listdir(path_case):
    pycg[group][case] = None

path_implicit = os.path.join(os.path.dirname(__file__), '..', 'docs', 'implicit')
for doc in os.listdir(path_implicit):
  path_doc = os.path.join(path_implicit, doc)
  # Group name = Document name - '.md'
  enre_group_name = doc[:-3]
  enre_statistic[enre_group_name] = 0
  with open(path_doc, 'r') as f:
    doc_outline = [{'type': 'group', 'content': enre_group_name}]
    for index, line in enumerate(f.readlines()):
      match_mark = re.match('\<\!--pycg:([a-zA-Z_]+)/([a-zA-Z_]+)( [a-zA-Z\-]+)?--\>', line)
      match_h6 = line.startswith('###### ')

      if match_h6:
        enre_case_name = line[7:-1]
        doc_outline.append({'type': 'case', 'content': enre_case_name})

      if match_mark:
        doc_outline.append({'type': 'mark', 'content': match_mark})

    # Handle doc_outline
    previous_case = None
    matched = False
    enre_group_name = doc_outline[0]['content']
    for item in doc_outline:
      if item['type'] == 'case':
        enre_statistic[enre_group_name] += 1
        if previous_case is not None and matched is False:
          if enre_group_name not in enre_new:
            enre_new[enre_group_name] = []
          enre_new[enre_group_name].append(previous_case)
        previous_case = item['content']
        matched = False
      elif item['type'] == 'mark':
        if previous_case is None:
          # Should be an ignore mark
          pycg[item['content'].group(1)][item['content'].group(2)] = {
            'status': False,
            # Remove the first spacing
            'id': item['content'].group(3)[1:],
          }
        else:
          pycg[item['content'].group(1)][item['content'].group(2)] = {
            'status': True,
            'id': f'{enre_group_name}/{previous_case}',
          }
          matched = True

statistic = {}
def get_item():
  return {
    'inherited': 0,
    'ignored': 0,
    'new': 0,
    'ignoreReason': [],
  }
for group in pycg:
  statistic[group] = get_item()
  for case in pycg[group]:
    if pycg[group][case] is None:
      statistic[group]['ignored'] += 1
      statistic[group]['ignoreReason'].append('WIP')
    elif pycg[group][case]['status'] == True:
      statistic[group]['inherited'] += 1
    else:
      statistic[group]['ignored'] += 1
      statistic[group]['ignoreReason'].append(pycg[group][case]['id'])

for group in enre_new:
  if group not in statistic:
    statistic[group] = get_item()
  statistic[group]['new'] += len(enre_new[group])

# Format print results into csv
print('PyCG Mapping table')
header = False
for group in sorted(statistic.keys()):
  if group in IGNORE_LIST:
    continue

  if header is False:
    print(', '.join(['Group'] + list(statistic[group].keys())))
    header = True

  print(', '.join([group] + [str(statistic[group][key]) if key != 'ignoreReason' else '/'.join(list(dict.fromkeys(statistic[group][key]))) for key in statistic[group].keys()]))

print('\n\nENRE Statistics')
print(', '.join(['Group', 'Test cases']))
for group in sorted(enre_statistic.keys()):
   print(', '.join([group, str(enre_statistic[group])]))
