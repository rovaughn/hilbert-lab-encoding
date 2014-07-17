import json
import sys
import collections
import math

def lookAt(data):
  data.sort()
  print('---------------------------------')
  print('  0', data[0])
  print('std', data[int(len(data)*0.15866)])
  print(' 50', data[len(data)//2])
  print('std', data[int(len(data)*0.84134)])
  print('100', data[-1])

with open('data.json') as f:
  for line in f:
    lookAt(json.loads(line))

