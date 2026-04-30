'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell,LineChart,Line,CartesianGrid } from 'recharts'
import { examsApi, analyticsApi } from '@/lib/api'

const DEMO_STATS={totalExams:5,totalCreditHours:16,conflictsDetected:1,highRiskExams:2,byType:{FINAL:3,MIDTERM:1,QUIZ:1}}
const DEMO_EXAMS=[
  {id:'1',course_code:'CS401',course_title:'Algorithms & Data Structures',exam_type:'FINAL',start_time:'2025-05-12T09:00:00Z',end_time:'2025-05-12T11:00:00Z',credit_hours:4},
  {id:'2',course_code:'MATH301',course_title:'Linear Algebra',exam_type:'MIDTERM',start_time:'2025-05-12T10:30:00Z',end_time:'2025-05-12T12:00:00Z',credit_hours:3},
  {id:'3',course_code:'PHYS201',course_title:'Classical Mechanics',exam_type:'FINAL',start_time:'2025-05-14T14:00:00Z',end_time:'2025-05-14T16:00:00Z',credit_hours:4},
  {id:'4',course_code:'CS350',course_title:'Operating Systems',exam_type:'QUIZ',start_time:'2025-05-15T13:00:00Z',end_time:'2025-05-15T13:45:00Z',credit_hours:3},
  {id:'5',course_code:'ENG201',course_title:'Technical Writing',exam_type:'FINAL',start_time:'2025-05-16T09:00:00Z',end_time:'2025-05-16T11:00:00Z',credit_hours:2},
]
const COLORS={FINAL:'#ff6b6b',MIDTERM:'#60cfff',QUIZ:'#c8ff00'}
const TT=({active,payload,label})=>active&&payload?.length?<div style={{background:'#1a1a24',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,padding:'8px 12px',fontSize:12}}><p style={{color:'rgba(255,255,255,.5)',marginBottom:4}}>{label}</p>{payload.map((p,i)=><p key={i} style={{color:p.color}}>{p.name||p.dataKey}: {p.value}</p>)}</div>:null

export default function AnalyticsPage(){
  const [stats,setStats]=useState(null)
  const [exams,setExams]=useState([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    Promise.all([analyticsApi.getSummary(),examsApi.getAll()])
      .then(([a,e])=>{setStats(a);setExams(e?.exams||e||[])})
      .catch(()=>{setStats(DEMO_STATS);setExams(DEMO_EXAMS)})
      .finally(()=>setLoading(false))
  },[])

  const s=stats||DEMO_STATS
  const typeData=Object.entries(s.byType||{FINAL:3,MIDTERM:1,QUIZ:1}).map(([name,value])=>({name,value}))
  const weeklyData=[{week:'Wk 1',hours:4},{week:'Wk 2',hours:8},{week:'Wk 3',hours:12},{week:'Exam Wk',hours:16}]
  const dayMap={}
  exams.forEach(e=>{const d=new Date(e.start_time).toLocaleDateString('en-US',{month:'short',day:'numeric'});dayMap[d]=(dayMap[d]||0)+1})
  const dailyData=Object.entries(dayMap).map(([date,count])=>({date,count}))

  const StatCard=({label,value,accent,sub})=>(
    <div className="glow-card" style={{padding:20}}>
      <p className="label">{label}</p>
      <p style={{fontSize:'2.2rem',fontFamily:'Bebas Neue,serif',letterSpacing:'.05em',color:accent||'white',lineHeight:1}}>{value}</p>
      {sub&&<p style={{fontSize:11,color:'rgba(255,255,255,.35)',marginTop:4}}>{sub}</p>}
    </div>
  )

  return(
    <div style={{display:'flex',minHeight:'100vh'}}>
      <Sidebar/>
      <main style={{marginLeft:220,flex:1,padding:32,maxWidth:1100}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:'Bebas Neue,serif',fontSize:'2.5rem',letterSpacing:'.1em',marginBottom:4}}>ANALYTICS</h1>
          <p style={{color:'rgba(255,255,255,.4)',fontSize:14}}>Workload analysis and exam insights</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}} className="stagger">
          <StatCard label="Total Exams" value={s.totalExams} sub="this semester"/>
          <StatCard label="Credit Hours" value={s.totalCreditHours} sub="total load"/>
          <StatCard label="Conflicts" value={s.conflictsDetected||0} accent={s.conflictsDetected?'#ff6b6b':undefined} sub="detected"/>
          <StatCard label="High Risk" value={s.highRiskExams||0} accent="#60cfff" sub="need attention"/>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:20,marginBottom:20}}>
          <div className="glow-card" style={{padding:20}}>
            <p className="label" style={{marginBottom:16}}>Exam Types</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={typeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {typeData.map(e=><Cell key={e.name} fill={COLORS[e.name]||'#888'}/>)}
              </Pie><Tooltip content={<TT/>}/></PieChart>
            </ResponsiveContainer>
            <div style={{display:'flex',justifyContent:'center',gap:16,marginTop:8}}>
              {typeData.map(t=><div key={t.name} style={{display:'flex',alignItems:'center',gap:5}}><span style={{width:8,height:8,borderRadius:'50%',background:COLORS[t.name]}}/><span style={{fontSize:10,color:'rgba(255,255,255,.4)'}}>{t.name}: {t.value}</span></div>)}
            </div>
          </div>
          <div className="glow-card" style={{padding:20}}>
            <p className="label" style={{marginBottom:16}}>Weekly Study Load (hrs)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData} barSize={32}>
                <XAxis dataKey="week" tick={{fill:'rgba(255,255,255,.3)',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'rgba(255,255,255,.3)',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<TT/>}/>
                <Bar dataKey="hours" fill="#c8ff00" radius={[4,4,0,0]} opacity={0.85}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {dailyData.length>0&&(
          <div className="glow-card" style={{padding:20,marginBottom:20}}>
            <p className="label" style={{marginBottom:16}}>Exams per Day</p>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
                <XAxis dataKey="date" tick={{fill:'rgba(255,255,255,.3)',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:'rgba(255,255,255,.3)',fontSize:11}} axisLine={false} tickLine={false} allowDecimals={false}/>
                <Tooltip content={<TT/>}/>
                <Line type="monotone" dataKey="count" stroke="#60cfff" strokeWidth={2} dot={{fill:'#60cfff',r:4}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="glow-card" style={{padding:20}}>
          <p className="label" style={{marginBottom:16}}>Exam Detail</p>
          <table style={{width:'100%',fontSize:12,borderCollapse:'collapse'}}>
            <thead><tr style={{borderBottom:'1px solid rgba(255,255,255,.08)'}}>
              {['Course','Type','Date','Duration','Credits','Risk'].map(h=><th key={h} style={{textAlign:'left',color:'rgba(255,255,255,.3)',fontWeight:'normal',paddingBottom:10,paddingRight:16}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {exams.map(ex=>{
                const s=new Date(ex.start_time),e=new Date(ex.end_time)
                const dur=Math.round((e-s)/60000)
                const risk=ex.exam_type==='FINAL'?'HIGH':ex.exam_type==='MIDTERM'?'MED':'LOW'
                const rc={HIGH:'#ff6b6b',MED:'#60cfff',LOW:'#c8ff00'}[risk]
                return <tr key={ex.id} style={{borderBottom:'1px solid rgba(255,255,255,.04)'}}>
                  <td style={{padding:'10px 16px 10px 0',color:'rgba(255,255,255,.7)'}}>{ex.course_code} <span style={{color:'rgba(255,255,255,.3)'}}>{ex.course_title?.slice(0,18)}</span></td>
                  <td style={{paddingRight:16,color:'rgba(255,255,255,.5)',fontFamily:'DM Mono,monospace',fontSize:10}}>{ex.exam_type}</td>
                  <td style={{paddingRight:16,color:'rgba(255,255,255,.45)'}}>{s.toLocaleDateString()}</td>
                  <td style={{paddingRight:16,color:'rgba(255,255,255,.45)'}}>{dur}m</td>
                  <td style={{paddingRight:16,color:'rgba(255,255,255,.45)'}}>{ex.credit_hours||'—'}</td>
                  <td style={{color:rc,fontFamily:'DM Mono,monospace',fontSize:10}}>{risk}</td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
          }
