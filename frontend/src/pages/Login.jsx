import React, { useEffect, useState } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';
import { getIdToken } from 'firebase/auth';
import api from '../api';

export default function Login(){
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [name, setName] = useState('');
  const [hostel, setHostel] = useState('');
  const [profileDone, setProfileDone] = useState(false);

  useEffect(()=>{
    if (!window.recaptcha) {
      window.recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    }
  },[]);

  const sendOtp = async ()=>{
    const e164 = phone.startsWith('+') ? phone : `+91${phone}`;
    const conf = await signInWithPhoneNumber(auth, e164, window.recaptcha);
    setConfirmation(conf);
    setOtpSent(true);
  };

  const verify = async ()=>{
    await confirmation.confirm(otp);
    const token = await auth.currentUser.getIdToken();
    // try to complete profile if provided
    if (name && hostel) {
      await api.post('/api/auth/complete-profile', { phone: auth.currentUser.phoneNumber, name, hostelAddress: hostel });
      setProfileDone(true);
    }
    alert('Logged in successfully! You can now place orders.');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="card space-y-3">
        <h2 className="text-xl font-bold">Phone Login (OTP)</h2>
        <div id="recaptcha-container"></div>
        {!otpSent ? (
          <>
            <input className="input" placeholder="Phone (10 digits)" value={phone} onChange={e=>setPhone(e.target.value)} />
            <button className="btn" onClick={sendOtp}>Send OTP</button>
          </>
        ):(
          <>
            <input className="input" placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <input className="input" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} />
              <input className="input" placeholder="Hostel Address" value={hostel} onChange={e=>setHostel(e.target.value)} />
            </div>
            <button className="btn" onClick={verify}>Verify & Continue</button>
          </>
        )}
      </div>
    </div>
  )
}
