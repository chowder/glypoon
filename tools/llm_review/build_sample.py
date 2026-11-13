import re, json, random, html, sys
import os
T = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..") + "/"
entries = {}
cur, buf = None, []
with open(T + "dictionaries/COED/dump.txt", encoding="utf-8") as f:
    for line in f:
        line = line.rstrip("\n")
        if line == "------":
            if cur: entries[cur] = "\n".join(buf)
            cur, buf = None, []
            continue
        if cur is None:
            w, _, rest = line.partition(":")
            cur, buf = w, [rest]
        else:
            buf.append(line)

def clean(s):
    s = re.sub(r"<c c=\"green\">(.*?)</c>", r"[POS:\1]", s)
    s = re.sub(r"<kref>(.*?)</kref>", r"{\1}", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    s = re.sub(r"\[[^\]]*ʊ[^\]]*\]|\[[^\]]*ə[^\]]*\]", "", s)  # drop IPA-ish
    s = re.sub(r"[ \t]+", " ", s)
    lines = [l.strip() for l in s.split("\n") if l.strip()]
    out = []
    for l in lines:
        if l.startswith("Phrases") or l.startswith("Derivatives") or l.startswith("Origin"): break
        out.append(l)
    return " | ".join(out)

def features(raw):
    pos = re.findall(r'■ <c c="green">(.*?)</c>', raw)
    redirect = "→ <kref>" in raw and not pos
    return pos, redirect

gly = [w.strip() for w in open(T + "corpuses/glypoon.txt")]
glyset = set(gly)
coed = [w.strip() for w in open(T + "corpuses/coed.txt", encoding="utf-8")]
outside = sorted({w for w in coed if re.fullmatch(r"[a-z]{3,10}", w) and w not in glyset})
rnd = random.Random(42)
sample = [(w, True) for w in rnd.sample(gly, 400)] + [(w, False) for w in rnd.sample(outside, 100)]
rnd.shuffle(sample)
rows = []
for i, (w, inlist) in enumerate(sample):
    raw = entries.get(w, "")
    pos, redirect = features(raw)
    rows.append(dict(id=i, word=w, in_current=inlist, pos=pos, redirect=redirect, entry=clean(raw)[:420]))
json.dump(rows, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample.json"), "w"), indent=1)
print(len(rows), sum(r["redirect"] for r in rows), sum(not r["entry"] for r in rows))
