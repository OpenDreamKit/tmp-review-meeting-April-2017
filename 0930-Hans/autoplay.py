import os
_HERE = os.path.dirname(__file__)
from IPython.display import display_javascript

with open(os.path.join(_HERE, 'autoplay.js')) as f:
    _AUTOPLAY_JS = f.read()

def autoplay():
    """Start autoplaying notebook with javascript"""
    display_javascript(_AUTOPLAY_JS, raw=True)

if __name__ == '__main__':
    autoplay()
