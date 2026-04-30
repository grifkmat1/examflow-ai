'use client'
import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { aiApi, examsApi } from '@/lib/api'

const EXAMPLES=[
  'I have a CS final exam on May 20th from 9am to 11am in Hall A, worth 4 credit hours',
  'Linear algebra midterm next Tuesday at 2pm for 90 minutes in Room 204',
  'Physics quiz on Friday May 23rd starting at 1:30pm, ends at 2:15pm',
]

const TC={FINAL:'badge-final',MIDTERM:'badge-midterm',QUIZ:'badge-quiz'}

export default function NLPPage(){
  const [text,setText]=useState('')
  const [parsed,setParsed]=useState(null)
  const [busy,setBusy]=useState(false)
  const [saved,setSaved]=useState(false)
  const [err,setErr]=useState('')

  async function parse(){
    if(!text.trim())return
    setBusy(true);setErr('');setParsed(null);setSaved(false)
    try{
      const d=await aiApi.parse(text)
      setParsed(d?.exam||d)
    }catch{
      // Demo fallback — simulate parsing
      const lower=text.toLowerCase()
      const type=lower.includes('final')?'FINAL':lower.includes('midterm')?'MIDTERM':'QUIZ'
      setParsed({
        course_code:'CS401',course_title:'Parsed from natural language',
        exam_type:type,start_time:'2025-05-20T09:00:00Z',end_time:'2025-05-20T11:00:00Z',
        semester:'Spring 2025',location:'Hall A',credit_hours:3,
        _demo:true
      })
    }finally{setBusy(false)}
  }

  async function save(){
    if(!parsed)return
    setBusy(true)
    try{
      await examsApi.create({...parsed,start_time:new Date(parsed.start_time).toISOString(),end_time:new Date(parsed.end_time).toISOString()})
      setSaved(true)
    }catch(ex){setErr('Could not save: '+ex.message)}
    finally{setBusy(false)}
  }

  const Field=({label,value})=>value?(
    <div style={{marginBottom:10}}>
      <span className="label" style={{marginBottom:3}}>{label}</span>
      <p style={{fontSize:13,color:'rgba(255,255,255,.8)',background:'rgba(255,255,255,.04)',padding:'8px 12px',borderRadius:6}}>{value}</p>
    </div>
  ):null

  return(
    <div style={{display:'flex',minHeight:'100vh'}}>
      <Sidebar/>
      <main style={{marginLeft:220,flex:1,padding:32,maxWidth:1000}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:'Bebas Neue,serif',fontSize:'2.5rem',letterSpacing:'.1em',marginBottom:4}}>NLP PARSER</h1>
          <p style={{color:'rgba(255,255,255,.4)',fontSize:14}}>Describe your exam in plain English — AI extracts the structured data</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
          <div>
            <div className="glow-card" style={{padding:24,marginBottom:16}}>
              <label className="label" style={{marginBottom:10}}>Describe your exam</label>
              <textarea
                className="input-dark"
                style={{resize:'none',height:140,lineHeight:1.6}}
                placeholder={'e.g. "I have a CS final exam on May 20th from 9am to 11am in Hall A"'}
                value={text}
                onChange={e=>setText(e.target.value)}
              />
              {err&&<p style={{color:'#ff6b6b',fontSize:12,marginTop:8}}>{err}</p>}
              <button className="btn-acid" onClick={parse} disabled={busy||!text.trim()} style={{width:'100%',marginTop:14}}>
                {busy?'Parsing...':'✦ Parse with AI'}
              </button>
            </div>

            <div className="glow-card" style={{padding:20}}>
              <p className="label" style={{marginBottom:12}}>Try these examples</p>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {EXAMPLES.map((ex,i)=>(
                  <button key={i} onClick={()=>setText(ex)} style={{
                    background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',
                    borderRadius:8,padding:'10px 14px',textAlign:'left',cursor:'pointer',
                    fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.5,transition:'.15s'
                  }} onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(200,255,0,.2)'}
                     onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(255,255,255,.08)'}>
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            {!parsed&&!busy&&(
              <div className="glow-card" style={{padding:24,height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,.15)'}}>
                <div style={{fontSize:40,marginBottom:12}}>💬</div>
                <p style={{fontSize:14}}>Parsed exam data will appear here</p>
              </div>
            )}
            {busy&&!parsed&&(
              <div className="glow-card" style={{padding:24,height:200,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <p style={{color:'rgba(200,255,0,.6)',fontSize:14,fontFamily:'DM Mono,monospace'}}>⟳ Parsing with Claude AI...</p>
              </div>
            )}
            {parsed&&(
              <div className="glow-card" style={{padding:24}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                  <p style={{fontSize:13,fontWeight:600,color:'rgba(255,255,255,.7)'}}>Parsed Result</p>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    {parsed._demo&&<span style={{fontSize:10,color:'rgba(255,255,255,.3)',fontFamily:'DM Mono,monospace'}}>DEMO</span>}
                    <span className={'badge '+(TC[parsed.exam_type]||'badge-quiz')}>{parsed.exam_type}</span>
                  </div>
                </div>
                <Field label="Course Code" value={parsed.course_code}/>
                <Field label="Course Title" value={parsed.course_title}/>
                <Field label="Start Time" value={parsed.start_time&&new Date(parsed.start_time).toLocaleString()}/>
                <Field label="End Time" value={parsed.end_time&&new Date(parsed.end_time).toLocaleString()}/>
                <Field label="Semester" value={parsed.semester}/>
                <Field label="Location" value={parsed.location}/>
                <Field label="Credit Hours" value={parsed.credit_hours}/>

                {saved?(
                  <div style={{marginTop:16,padding:'12px 16px',background:'rgba(200,255,0,.08)',border:'1px solid rgba(200,255,0,.2)',borderRadius:8,fontSize:13,color:'#c8ff00',textAlign:'center'}}>
                    ✓ Exam saved to your schedule!
                  </div>
                ):(
                  <button className="btn-acid" onClick={save} disabled={busy} style={{width:'100%',marginTop:16}}>
                    {busy?'Saving...':'+ Add to Schedule'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
