from PIL import Image, ImageDraw
O='study/critique/frame_r1/'
def L(p): return Image.open(p).convert('RGB')
k=1080/185
for f,box in [('frame2',(60,150,185,290)),('frame6',(0,140,185,280))]:
    a=L('study/ref/'+f+'.png').crop(box); a=a.resize((int(a.width*k),int(a.height*k)),Image.NEAREST)
    m=L('frames/check2/t14.00.png').crop((0,700,int(box[2]-box[0])*k,700+int((box[3]-box[1])*k)))
    c=Image.new('RGB',(a.width+m.width+20,a.height),(40,40,40)); c.paste(a,(0,0)); c.paste(m,(a.width+20,0)); c.save(O+f'side_scale_{f}.png')
