import React from 'react'

function Contact() {
  return (
    <div className='min-h-[300px] sm:min-h-[400px] bg-gradient-to-br from-purple-600 to-purple-800 mt-2 flex flex-col items-center justify-center text-white p-4 sm:p-8 rounded-lg mx-2 sm:mx-4'>
      <h1 className='text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 text-center'>Contact Love Eagles</h1>
      <div className='text-center space-y-2 sm:space-y-4'>
        <p className='text-sm sm:text-base lg:text-lg'>Uche Nora & Chikamso Chidebe</p>
        <p className='text-xs sm:text-sm lg:text-base text-purple-200'>Academic Excellence • In God We Trust</p>
        <div className='mt-4 sm:mt-6 space-y-2'>
          <p className='text-xs sm:text-sm'>📧 Email: loveeagles@academic.com</p>
          <p className='text-xs sm:text-sm'>🎓 Academic Planning & Productivity</p>
        </div>
      </div>
    </div>
  )
}

export default Contact