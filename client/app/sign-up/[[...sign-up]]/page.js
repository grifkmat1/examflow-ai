import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#0a0a0f'}}>
      <div style={{textAlign:'center',marginBottom:32}}>
        <h1 style={{fontFamily:'Bebas Neue,serif',fontSize:'3rem',letterSpacing:'.2em',color:'#c8ff00',marginBottom:4}}>EXAMFLOW</h1>
        <p style={{color:'rgba(255,255,255,.3)',fontSize:14}}>Create your account</p>
      </div>
      <SignUp appearance={{elements:{
        card:'bg-ink-800 border border-white/10 shadow-2xl',
        headerTitle:'text-white',headerSubtitle:'text-white/40',
        formFieldLabel:'text-white/60 text-xs',
        formFieldInput:'bg-ink-900 border-white/10 text-white',
        formButtonPrimary:'bg-acid-400 text-ink-950 hover:bg-acid-500 font-semibold',
        footerActionLink:'text-acid-400',
      }}}/>
    </main>
  )
}
