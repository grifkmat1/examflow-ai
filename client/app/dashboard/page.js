'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import { examsApi, analyticsApi } from '@/lib/api'

const DEMO = { totalExams:5, totalCreditHours:16, conflictsDetected:1, highRiskExams:2 }
const DEMO_EXAMS = [
  { id:'1', course_code:'CS401', course_title:'Algorithms & Data Structures', exam_type:'FINAL', start_time:'2025-05-12T09:00:00Z', end_time:'2025-05-12T11:00:00Z', semester:'Spring 2025' },
  { id:'2', course_code:'MATH301', course_title:'Linear Algebra', exam_type:'MIDTERM', start_time:'2025-05-14T10:00:00Z', end_time:'2025-05-14T12:00:00Z', semester:'Spring 2025' },
  { id:'3', course_code:'PHYS201', course_title:'Classical Mechanics', exam_type:'FINAL', start_time:'2025-05-16T14:00:00Z', end_time:'2025-05-16T16:00:00Z', semester:'Spring 2025' },
]

function StatCard({ label, value, accent, sub }) {
  return (
    <div className="glow-card" style={{padding:20}}>
      <p className="label">{label}</p>
      <p style={{fontSize:'2.2rem',fontFamily:'Bebas Neue,serif',letterSpacing:'.05em',color:accent||'white',lineHeight:1}}>{value}</p>
      {sub && <p style={{fontSize:11,color:'rgba(255,255,255,.35)',marginTop:4}}>{sub}</p>}
    </div>
  )
}

const typeColor = { FINAL:'badge-final', MIDTERM:'badge-midterm', QUIZ:'badge-quiz' }

export default function Dashboard() {
  const [exams,setExams] = useState([])
  const [stats,setStats] = useState(null)
  const [live,setLive] = useState(false)

  useEffect(() => {
    Promise.all([examsApi.getAll(), analyticsApi.getSummary()])
      .then(([e,a]) => { setExams((e?.exams||e||[]).slice(0,3)); setStats(a); setLive(true) })
      .catch(() => { setExams(DEMO_EXAMS); setStats(DEMO) })
  },[])

  const s = stats || DEMO
  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <Sidebar />
      <main style={{marginLeft:220,flex:1,padding:32,maxWidth:900}}>
        <div style={{marginBottom:32}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:4}}>
            <h1 style={{fontFamily:'Bebas Neue,serif',fontSize:'2.5rem',letterSpacing:'.1em'}}>DASHBOARD</h1>
            <span style={{fontSize:10,fontFamily:'DM Mono,monospace',padding:'3px 10px',borderRadius:20,background:live?'rgba(200,255,0,.1)':'rgba(255,255,255,.05)',color:live?'#c8ff00':'rgba(255,255,255,.3)'}}>
              {live?'● API LIVE':'● DEMO MODE'}
            </span>
          </div>
          <p style={{color:'rgba(255,255,255,.4)',fontSize:14}}>Your exam schedule at a glance</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32}}>
          <StatCard label="Total Exams" value={s.totalExams} sub="this semester"/>
          <StatCard label="Conflicts" value={s.conflictsDetected||0} accent={s.conflictsDetected?'#ff6b6b':undefined} sub="detected"/>
          <StatCard label="Credit Hours" value={s.totalCreditHours} sub="total load"/>
          <StatCard label="High Risk" value={s.highRiskExams||0} accent="#60cfff" sub="need attention"/>
        </div>

        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <p className="label">Upcoming Exams</p>
          <Link href="/exams" style={{fontSize:12,color:'rgba(200,255,0,.7)',textDecoration:'none'}}>View all →</Link>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:32}} className="stagger">
          {exams.map(ex => (
            <div key={ex.id} className="glow-card" style={{padding:18}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                <span style={{fontSize:11,fontFamily:'DM Mono,monospace',color:'rgba(255,255,255,.35)'}}>{ex.course_code}</span>
                <span className={'badge '+typeColor[ex.exam_type]}>{ex.exam_type}</span>
              </div>
              <p style={{fontSize:13,fontWeight:500,marginBottom:8}}>{ex.course_title}</p>
              <p style={{fontSize:11,color:'rgba(255,255,255,.4)'}}>{new Date(ex.start_time).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
          {[{href:'/exams',icon:'📋',label:'Manage Exams'},{href:'/study-plans',icon:'🧠',label:'Study Plans'},{href:'/analytics',icon:'📊',label:'Analytics'}].map(a => (
            <Link key={a.href} href={a.href} className="glow-card" style={{padding:16,display:'flex',alignItems:'center',gap:12,textDecoration:'none',color:'rgba(255,255,255,.6)',fontSize:13}}>
              <span>{a.icon}</span>{a.label}
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
