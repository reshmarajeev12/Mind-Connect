import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>ABOUT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Welcome to MindConnect, your trusted platform for connecting with licensed psychologists in real time. We understand the challenges individuals face when seeking mental health support, from finding the right professional to scheduling appointments conveniently. With MindConnect, we make this process seamless, allowing users to book sessions, make secure payments, and chat with psychologists—all in one place.</p>
          <p>At MindConnect, we are committed to revolutionizing mental healthcare through technology. Our platform integrates advanced scheduling, encrypted real-time chat, and secure payment systems to enhance user experience. Whether you're booking your first therapy session or engaging in ongoing counseling, MindConnect ensures you receive timely, confidential, and professional support when you need it most.</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Our vision at MindConnect is to create a seamless and accessible mental health support system for everyone. We aim to bridge the gap between individuals and qualified psychologists, making it easier to seek professional help without barriers. By offering a user-friendly interface, flexible appointment booking, and real-time chat with experts, we empower users to take control of their mental well-being—anytime, anywhere.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY  <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICIENCY:</b>
          <p>Quick and easy appointment booking that fits your schedule.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIENCE: </b>
          <p>Instant access to licensed psychologists for real-time chat.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZATION:</b>
          <p >Tailored therapy sessions and reminders to support your mental well-being.</p>
        </div>
      </div>

    </div>
  )
}

export default About
