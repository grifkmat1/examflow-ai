'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const nav = [
  { href:'/dashboard', label:'Dashboard', icon:'⊞' },
  { href:'/exams', label:'Exams', icon:'📋' },
  { href:'/study-plans', label:'Study Plans', icon:'🧠' },
  { href:'/analytics', label:'Analytics', icon:'📊' },
  { href:'/nlp', label:'NLP Parser', icon:'💬' },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside style={{width:220,background:'var(--ink-900)',borderRight:'1px solid rgba(255,255,255,.06)',height:'100vh',position:'fixed',left:0,top:0,display:'flex',flexDirection:'column',zIndex:40}}>
      <div style={{padding:'20px 24px',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
        <div style={{fontFamily:'Bebas Neue,serif',fontSize:'1.25rem',letterSpacing:'.15em',color:'#c8ff00'}}>EXAMFLOW</div>
        <div style={{fontSize:10,color:'rgba(255,255,255,.3)',marginTop:2}}>AI Scheduling Platform</div>
      </div>
      <nav style={{flex:1,padding:'12px 12px'}}>
        {nav.map(({href,label,icon}) => {
          const active = path === href || path.startsWith(href+'/')
          return (
            <Link key={href} href={href} style={{
              display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:8,
              marginBottom:2,fontSize:14,textDecoration:'none',transition:'.15s',
              background: active ? 'rgba(200,255,0,.1)' : 'transparent',
              color: active ? '#c8ff00' : 'rgba(255,255,255,.5)',
              fontWeight: active ? 500 : 400,
            }}>
              <span style={{fontSize:13}}>{icon}</span>{label}
              {active && <span style={{marginLeft:'auto',width:5,height:5,background:'#c8ff00',borderRadius:'50%'}} />}
            </Link>
          )
        })}
      </nav>
      <div style={{padding:'16px 20px',borderTop:'1px solid rgba(255,255,255,.06)',display:'flex',alignItems:'center',gap:10}}>
        <UserButton afterSignOutUrl="/" />
        <span style={{fontSize:12,color:'rgba(255,255,255,.4)'}}>Account</span>
      </div>
    </aside>
  )
}
