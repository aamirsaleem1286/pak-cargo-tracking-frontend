import React from 'react'

const OurBranch = () => {
  return (
    <>
      <div className="text-5xl font-extrabold text-center text-blue-800 mt-7">
        <h1>Our Branches</h1>
      </div>
      <div className="flex justify-center w-2/2 h-auto m-auto mt-10 mb-10 mx-4 tex-2xl">
        <div className="">
          <h1 className='text-bolder text-3xl'>Dammam Head Office</h1>
          <p>
            Address: Dammam Al-Khaleej, Street 22, <br/>Double Road Opposite Boys
            School
          </p>
          <p>Phone: +966 591 080611 | +966 590 878234 | +966 590 056199</p>
        </div>
        <div className="p-11"></div>
        <div>
          <h1 className='text-bolder text-3xl'>Al-Thuqbah Office</h1>
          <p>
            Address: Al-Thuqbah, Rabigh Street 18, <br/> Opposite Fish Market, Near
            Graveyard.
          </p>
          <p>Phone: +966 580 129991 | +966 553 441378 | +966 591 080611</p>
        </div>
        <div className="p-11"></div>
        <div>
          <h1 className='text-bolder text-3xl'>AL HASSA(-HOFUF)</h1>
          <p>
            Office Al-Hofuf Opposite General Court,<br/> Al Koot Al Naathil Mosque
          </p>
          <p>Phone: +966 599 039931 | +966 539 328832 |+966 591 080611</p>
        </div>
      </div>
    </>
  );
}

export default OurBranch