'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { examsApi } from '@/lib/api'

const EMPTY={course_code:'',course_title:'',exam_type:'FINAL',start_time:'',end_time:'',semester:'Spring 2025',location:'',credit_hours:''}
const DEMO=[
  {id:'1',course_code:'CS401',course_title:'Algorithms & Data Structures',exam_type:'FINAL',start_time:'2025-05-12T09:00:00Z',end_time:'2025-05-12T11:00:00Z',semester:'Spring 2025',location:'Hall A-101',credit_hours:4},
  {id:'2',course_code:'MATH301',course_title:'Linear Algebra',exam_type:'MIDTERM',start_time:'2025-05-12T10:30:00Z',end_time:'2025-05-12T12:00:00Z',semester:'Spring 2025',location:'Hall B-203',credit_hours:3},
  {id:'3',course_code:'PHYS201',course_title:'Classical Mechanics',exam_type:'FINAL',start_time:'2025-05-14T14:00:00Z',end_time:'2025-05-14T16:00:00Z',semester:'Spring 2025',location:'Lab C',credit_hours:4},
]
const TC={FINAL:'badge-final',MIDTERM:'badge-midterm',QUIZ:'badge-quiz'}

export default function ExamsPage(){
  const [exams,setExams]=useState([])
  const [form,setForm]=useState(EMPTY)
  const [conflicts,setConflicts]=useState([])
  const [err,setErr]=useState('')
  const [busy,setBusy]=useState(false)
  const [loaded,setLoaded]=useState(false)

  useEffect(()=>{load()},[])

  async function load(){
    try{
      const d=await examsApi.getAll()
      const list=d?.exams||d||[]
      setExams(list)
      if(list.length>1){const c=await examsApi.detectConflicts(list);setConflicts(c?.conflicts||[])}
    }catch{setExams(DEMO)}
    setLoaded(true)
  }

  async function submit(e){
    e.preventDefault();setBusy(true);setErr('')
    try{
      await examsApi.create({...form,start_time:new Date(form.start_time).toISOString(),end_time:new Date(form.end_time).toISOString(),credit_hours:form.credit_hours?Number(form.credit_hours):undefined})
      setForm(EMPTY);await load()
    }catch(ex){setErr(ex.message)}finally{setBusy(false)}
  }

  async function del(id){
    if(!confirm('Delete this exam?'))return
    try{await examsApi.delete(id)}catch{}
    setExams(p=>p.filter(e=>e.id!==id))
  }

  const inp=(k,v)=>setForm(f=>({...f,[k]:v}))
  const S={fontFamily:'DM Sans,sans-serif'}

  return(
    <div style={{display:'flex',minHeight:'100vh'}}>
      <Sidebar/>
      <main style={{marginLeft:220,flex:1,padding:32,maxWidth:1100}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:'Bebas Neue,serif',fontSize:'2.5rem',letterSpacing:'.1em',marginBottom:4}}>EXAMS</h1>
          <p style={{color:'rgba(255,255,255,.4)',fontSize:14}}>Add, view, and manage your exam schedule</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'320px 1fr',gap:24,alignItems:'start'}}>
          <div className="glow-card" style={{padding:24}}>
            <p style={{fontSize:13,fontWeight:600,marginBottom:18,color:'rgba(255,255,255,.7)'}}>Add Exam</p>
            <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:11,...S}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div><label className="label">Code</label><input className="input-dark" placeholder="CS401" value={form.course_code} onChange={e=>inp('course_code',e.target.value)} required/></div>
                <div><label className="label">Type</label>
                  <select className="input-dark" value={form.exam_type} onChange={e=>inp('exam_type',e.target.value)}>
                    <option>FINAL</option><option>MIDTERM</option><option>QUIZ</option>
                  </select>
                </div>
              </div>
              <div><label className="label">Course Title</label><input className="input-dark" placeholder="Algorithms & Data Structures" value={form.course_title} onChange={e=>inp('course_title',e.target.value)} required/></div>
              <div><label className="label">Start Time</label><input type="datetime-local" className="input-dark" value={form.start_time} onChange={e=>inp('start_time',e.target.value)} required/></div>
              <div><label className="label">End Time</label><input type="datetime-local" className="input-dark" value={form.end_time} onChange={e=>inp('end_time',e.target.value)} required/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div><label className="label">Semester</label><input className="input-dark" value={form.semester} onChange={e=>inp('semester',e.target.value)} required/></div>
                <div><label className="label">Credits</label><input type="number" className="input-dark" placeholder="3" value={form.credit_hours} onChange={e=>inp('credit_hours',e.target.value)}/></div>
              </div>
              <div><label className="label">Location</label><input className="input-dark" placeholder="Hall A-101" value={form.location} onChange={e=>inp('location',e.target.value)}/></div>
              {err&&<p style={{color:'#ff6b6b',fontSize:12}}>{err}</p>}
              <button type="submit" className="btn-acid" disabled={busy} style={{marginTop:4}}>{busy?'Adding...':'+ Add Exam'}</button>
            </form>
          </div>

          <div>
            {conflicts.length>0&&(
              <div style={{marginBottom:16}}>
                {conflicts.map((c,i)=>(
                  <div key={i} className="conflict-alert" style={{marginBottom:8,display:'flex',gap:12,alignItems:'flex-start'}}>
                    <span style={{color:'#ff6b6b',marginTop:1}}>⚠</span>
                    <div><p style={{fontSize:13,fontWeight:500,color:'#ff6b6b',marginBottom:2}}>{c.type||'Schedule Conflict'}</p><p style={{fontSize:12,color:'rgba(255,255,255,.5)'}}>{c.message}</p></div>
                  </div>
                ))}
              </div>
            )}
            <p className="label" style={{marginBottom:12}}>{exams.length} Exam{exams.length!==1?'s':''}</p>
            <div style={{display:'flex',flexDirection:'column',gap:10}} className="stagger">
              {exams.map(ex=>(
                <div key={ex.id} className="glow-card" style={{padding:'14px 18px',display:'flex',alignItems:'center',gap:14}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontSize:11,fontFamily:'DM Mono,monospace',color:'rgba(255,255,255,.4)'}}>{ex.course_code}</span>
                      <span className={'badge '+(TC[ex.exam_type]||'badge-quiz')}>{ex.exam_type}</span>
                      {ex.credit_hours&&<span style={{fontSize:10,color:'rgba(200,255,0,.5)',marginLeft:'auto'}}>{ex.credit_hours} cr</span>}
                    </div>
                    <p style={{fontSize:13,fontWeight:500,marginBottom:5,color:'rgba(255,255,255,.85)'}}>{ex.course_title}</p>
                    <p style={{fontSize:11,color:'rgba(255,255,255,.35)'}}>
                      {new Date(ex.start_time).toLocaleDateString()} · {new Date(ex.start_time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})} – {new Date(ex.end_time).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                      {ex.location&&' · '+ex.location}
                    </p>
                  </div>
                  <button onClick={()=>del(ex.id)} style={{background:'none',border:'none',color:'rgba(255,255,255,.2)',cursor:'pointer',fontSize:15,padding:6,borderRadius:6,transition:'.15s'}} onMouseEnter={e=>e.target.style.color='#ff6b6b'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,.2)'}>✕</button>
                </div>
              ))}
              {loaded&&exams.length===0&&<div style={{textAlign:'center',padding:40,color:'rgba(255,255,255,.2)',fontSize:14}}>No exams yet. Add your first one →</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
                      }
