import numpy as np
from PIL import Image
def period(p,box,scale):
    a=np.asarray(Image.open(p).convert('L').crop(box)).astype(float)
    a-=a.mean()
    F=np.abs(np.fft.fft2(a))**2; ac=np.real(np.fft.ifft2(F)); ac/=ac[0,0]
    # radial average
    h,w=a.shape; yy,xx=np.indices((h,w)); yy=np.minimum(yy,h-yy); xx=np.minimum(xx,w-xx); r=np.sqrt(xx**2+yy**2).astype(int)
    rad=np.bincount(r.ravel(),ac.ravel())/np.maximum(np.bincount(r.ravel()),1)
    # first local max after first min
    i=1
    while i<len(rad)-1 and not (rad[i]<rad[i-1] and rad[i]<=rad[i+1]): i+=1
    j=i+1
    while j<min(len(rad)-1,200) and not (rad[j]>=rad[j-1] and rad[j]>=rad[j+1]): j+=1
    print(f"{p} {box}: first min r={i} peak r={j} -> period {j*scale:.0f}px @1080w  (corr width at 0.5: {np.argmax(rad<0.5)*scale:.0f}px)")
period('study/ref/frame5.webp',(0,150,666,330),1080/666)
period('study/ref/frame2.png',(0,40,185,140),1080/185)
period('study/ref/frame3.png',(0,40,185,130),1080/185)
period('study/ref/frame6.png',(0,40,185,130),1080/185)
period('frames/qa/match.png',(0,180,380,1300),1)
period('frames/check2/t6.00.png',(0,300,330,1000),1)
