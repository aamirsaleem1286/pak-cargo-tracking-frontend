import React from 'react'
import { Td, Th } from './TrackCompo';
import moment from 'moment'
export const TrackingHistory = ({trackingHistory}:{trackingHistory:any[]}) => {
  console.log("track",trackingHistory)  
  
   
  return (
  <section className="mt-5 rounded-lg border border-gray-200 shadow-sm w-full">
  {/* Desktop Table */}
  <table className="ml-4 sm:table w-full text-left lg:text-3xl text-xs sm:text-sm">
    <thead className="bg-blue-800 text-white text-center">
      <tr>
        <Th>#</Th>
        <Th>Date</Th>
        <Th>Invoice</Th>
        <Th>Pieces</Th>
        <Th>Status</Th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100 text-center ">
      {[...trackingHistory].reverse().map((history, index) => {
         const isoDateBooking = history.oldStatusDate;
  const formattedBooking = moment(isoDateBooking).format("DD MMM YYYY");
  
      //  const formattedDate = moment(history.oldStatusDate).format('DD MMM YYYY');
        
        return (
          <tr
            key={index}
            className={` hover:bg-blue-100 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}
          >
            <Td>{index + 1}</Td>
            <Td>{formattedBooking}</Td>
            <Td>{history.invoiceId}</Td>
            <Td>{history.pieces}</Td>
            <Td>{history.oldStatus}</Td>
          </tr>
        );
      })}
    </tbody>
  </table>


</section>

  )
}
