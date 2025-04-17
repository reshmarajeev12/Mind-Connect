import React from 'react'
import { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import {socket} from '../../socket'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

//   const notifyUser = (appointmentId) => {
//     socket.emit("doctorReady", { appointmentId });
// };


const notifyUser = (appointmentId) => {
  if (!socket) {
    socket.connect(); 
  }
  console.log(`Notifying user for appointment ID: ${appointmentId}`);
  socket.emit("doctorReady", { appointmentId });

// const handleNotifyUser = (userId) => {
//   socket.emit("notifyUser", { userId });
  toast.success("Notification sent to the user!", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};
// useEffect(() => {
//   socket.on("userJoinedChat", ({ appointmentId }) => {
//       toast.info("User has reached the chat room.");
//   });

//   return () => socket.off("userJoinedChat");
// }, []);

// const handleNotifyUser = (userId) => {
//   socket.emit("notifyUser", { userId });
// };

useEffect(() => {
  socket.on('userJoinedChat', ({ appointmentId }) => {
    toast.info('👤 User has reached the chat room!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
      className: 'custom-toast',
    });
  });

  return () => socket.off('userJoinedChat');
}, []);


  return (
    <div className='w-full max-w-6xl m-5 '>
      <ToastContainer />
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>
            <div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>
                {item.payment?'Online':'CASH'}
              </p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{currency}{item.amount}</p>
            {item.cancelled
              ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : item.isCompleted
                ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                : <div className='flex'>
                  <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                </div>
            }
                {/* Centered Chat & Notify Buttons */}
                <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => navigate(`/doctor/chat/${item._id}`)}
                className="text-white bg-blue-500 px-14 py-3 mt-4 rounded-md hover:bg-blue-600 transition"
              >
                Start Chat
              </button>
              <button
                onClick={() => notifyUser(item._id)}
                // onClick={() => handleNotifyUser(item.userData._id)}
                className="bg-green-500 text-white px-6 py-3 mt-2 rounded-md hover:bg-green-600 transition"
              >
                Notify User: Ready to Chat
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default DoctorAppointments