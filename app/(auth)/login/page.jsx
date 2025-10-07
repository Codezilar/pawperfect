import { SignIn } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className="dogs">
        <div className="dogs-conatiner">
            <div className="sign-in">
                <SignIn />
            </div>
        </div>
    </div>
  )
}

export default page