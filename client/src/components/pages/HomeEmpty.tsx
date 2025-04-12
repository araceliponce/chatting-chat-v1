import { Link } from 'react-router-dom'

export const HomeEmpty = () => {
  return (
    <main className="homepage grid-center ">
      <div className="section-container p-8">

        <div className='space-y-2 homepage__grid  py-8'>

          <div>
            <span>
              Hello!
            </span>
            <h1 className='homepage__title'>
              This is
              where you can create groups and send messages.
            </h1>
            <p className='opacity-80 text-lg'>
              React + TypeScript + GraphQL fullstack web app
            </p>
            <div className="homepage__btns pt-4 items-center">
              <Link to="/login" className="btn btn--main">
                Login
              </Link>
              <Link to="/signup" className="btn btn--secondary">
                Sign up
              </Link>

            </div>
          </div>


          <div aria-hidden className='flex ms-auto sm:mx-auto max-w-[15rem] sm:max-w-[20rem] sm:grid items-center'>
            <svg width="345" height="337" viewBox="0 0 345 337" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 239.105H99.4891V336.187H172.202L172.236 168.094H0V239.105Z" fill="#7151ffba"></path>
              <path d="M244.952 0H172.239V168.093H344.441V97.1152H244.952V0Z" fill="#7151ff4e"></path>
            </svg>
            <img src="/stickers/letsgo.webp" alt="" />
            <svg width="345" height="337" viewBox="0 0 345 337" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 239.105H99.4891V336.187H172.202L172.236 168.094H0V239.105Z" fill="#7151ff57"></path>
              <path d="M244.952 0H172.239V168.093H344.441V97.1152H244.952V0Z" fill="#7151ff"></path>
            </svg>
          </div>
        </div>

      </div>
    </main>
  )
}
