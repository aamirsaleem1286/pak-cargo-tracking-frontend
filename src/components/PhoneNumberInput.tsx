import React from 'react'
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const PhoneNumberInput = ({value,handleChange,name,disable=false}) => {
  return (
    <PhoneInput
      disabled={disable}
      name={name}
        defaultCountry="sa"
        value={value}
      onChange={(phone) => handleChange({ target: { name, value: phone } })}
      //  onCountryChange={(country) => setCountry(name, country.dialCode)}
      inputStyle={{width:'100%'}}
        className='w-full border'
    />
  )
}

export default PhoneNumberInput
