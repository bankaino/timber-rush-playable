from PIL import Image, ImageDraw
R='study/ref/'; O='study/critique/frame_r1/'
def L(p): return Image.open(p).convert('RGB')
r5=L(R+'frame5.webp'); m=L('frames/qa/match.png'); t19=L('frames/check2/t19.75.png'); t14=L('frames/check2/t14.00.png'); t6=L('frames/check2/t6.00.png')
k=1080/666
def side(name, rbox, ours, obox, z=1.5):
    a=r5.crop(rbox); a=a.resize((int(a.width*k*z),int(a.height*k*z)),Image.LANCZOS)
    b=ours.crop(obox); b=b.resize((int(b.width*z),int(b.height*z)),Image.LANCZOS)
    H=max(a.height,b.height); W=a.width+b.width+20
    c=Image.new('RGB',(W,H+40),(40,40,40)); c.paste(a,(0,40)); c.paste(b,(a.width+20,40))
    d=ImageDraw.Draw(c); d.text((5,5),'REF frame5 (same screen scale)',fill='white'); d.text((a.width+25,5),'OURS',fill='white')
    c.save(O+name)
side('side_harvester.png',(240,540,600,800),m,(380,860,700,1300),1.2)
side('side_forest.png',(0,150,300,340),m,(0,0,490,310),1.6)
side('side_cleared.png',(0,380,260,560),m,(280,440,700,730),1.6)
side('side_yard.png',(0,680,560,1000),t6,(0,1120,910,1640),0.9)
side('side_edge.png',(0,300,666,420),t19,(0,180,1080,380),1.0)
