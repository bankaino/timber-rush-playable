import numpy as np
from PIL import Image
import colorsys, sys
R='study/ref/'
def load(p): return Image.open(p).convert('RGB')
def stats(im,box,name):
    a=np.asarray(im.crop(box)).astype(float)/255
    mx=a.max(2); mn=a.min(2); L=0.2126*a[...,0]+0.7152*a[...,1]+0.0722*a[...,2]
    ch=mx-mn
    p=lambda v:[round(float(np.percentile(v,q)),2) for q in (5,25,50,75,95)]
    # hue of mean
    m=a.reshape(-1,3).mean(0)
    h,s,v=colorsys.rgb_to_hsv(*m)
    print(f"{name:28s} V {p(mx)} | lum {p(L)} | chroma {p(ch)} | mean #{''.join('%02x'%int(c*255) for c in m)} hue {h*360:.0f}")
r5=load(R+'frame5.webp'); m=load('frames/qa/match.png'); t6=load('frames/check2/t6.00.png'); t19=load('frames/check2/t19.75.png')
r2=load(R+'frame2.png'); r6=load(R+'frame6.png'); r3=load(R+'frame3.png')
print('--- forest (dense trees)')
stats(r5,(0,140,666,330),'ref5 forest top')
stats(r3,(0,40,185,120),'ref3 forest')
stats(r6,(0,40,185,130),'ref6 forest')
stats(m,(0,0,1080,330),'ours match forest top')
stats(m,(820,400,1080,1300),'ours match forest right')
stats(t6,(0,300,330,1000),'ours t6 forest left')
print('--- cleared ground')
stats(r5,(0,380,250,540),'ref5 cleared')
stats(r5,(380,1000,666,1200),'ref5 cleared bottom')
stats(r3,(80,160,180,300),'ref3 cleared')
stats(m,(300,450,760,850),'ours match cleared')
stats(t19,(100,300,1000,550),'ours t19 cleared')
print('--- concrete')
stats(r5,(120,700,400,900),'ref5 concrete')
stats(m,(50,1430,850,1600),'ours concrete')
print('--- whole frame (game area)')
stats(r5,(0,130,666,1310),'ref5 game area')
stats(r2,(0,30,185,345),'ref2 game area')
stats(m,(0,0,1080,1920),'ours match')
stats(t19,(0,0,1080,1920),'ours t19')
