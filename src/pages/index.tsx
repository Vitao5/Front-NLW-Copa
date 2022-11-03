import Image from 'next/image'
import bg_preview from '../assets/celulares.png'
import logo from '../assets/logo.svg'
import avatares from '../assets/avatares.png'
import iconCheck from '../assets/iconCheck.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps{
    poolCount: number,
    guessCount: number,
    usersCount: number
  }
  


export default function Home(props: HomeProps) {
  const [poolTile, setPoolTitle] = useState('')
  
 async function newPool(event: FormEvent){
    event.preventDefault()
    
    try{
      const response = await api.post('/pools',{
        title: poolTile
      })
      const {code} = response.data

      await navigator.clipboard.writeText(code)
      alert('Boão criado com sucesso')
      setPoolTitle('')
    }
    catch (err){
      alert('Ocorreu um erro ao criar o bolão')
    }
  }

  return (
   <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
    <main>
      <div >
        <Image src={logo} alt="logo nlw" />
        <h1 className='mt-14 text-white-500 text-5xl font-bold leading-tight ' >Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={avatares} alt='avatar pessoas que estão participando da NLW Copa'  quality={100}/>
          <strong className='text-grey-100 text-xl '>
            <span className='text-ignite-500  px-2'>+{props.usersCount}</span>
            pessoas estão usando
          </strong>
        </div>

        <form className='mt-10 flex gap-3' onSubmit={newPool}>
          <input  
          className='bg-grey-800 flex-1 px-6 py-4 rounded border border-grey-600 text-sm text-grey-100' 
          type="text"
          required
          placeholder='Qual nome do bolão?'
          onChange={ event => setPoolTitle(event.target.value)}
          value={poolTile}
          />
          <button 
          className='bg-yellow-500 text-grey-900  px-6 py-4  rounded font-bold text-sm uppercase hover:bg-yellow-700' 
          type='submit'>Criar meu bolão</button>
        </form>

        <p className='text-grey-300 mt-4 text-sm leading-relaxed' >Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className='mt-10 pt-10 border-t border-grey-600  flex items-center justify-between text-grey-100'>
          <div className='flex items-center gap-6'> 
              <Image src={iconCheck} alt='ícone verde' quality={100}/>
              <div className='flex flex-col'>
                <span className='font-bold text-2xl'>+{props.poolCount}</span>
                <span>Bolões criados</span>
              </div>
          </div>

          <div className='w-px h-14 bg-grey-600'/>

          <div className='flex items-center gap-6'>
              <Image src={iconCheck} alt='ícone verde' quality={100}/>
              <div className='flex flex-col'>
                <span className='font-bold text-2xl'>+{props.guessCount}</span>               
                <span>Palpites enviados</span>
              </div>
          </div>
        </div>
   
      </div>
    </main>
      <Image src={bg_preview} className='mt-6' alt="dois celulares com tema nlw" quality={100} />
   </div>
  )
}

export async function getStaticProps() {
  const [
    poolCountResponse,
    guessCountResponse, 
    usersCountResponse 
  ] = await Promise.all([
   
      api.get('pools/count'),
      api.get('guesses/count'),
      api.get('user/count')

  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count
    }
  }
}
