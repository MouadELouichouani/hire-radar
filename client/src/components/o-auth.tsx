import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const OAuth = () => {
    return (
        <Button variant="outline" type="button" className="cursor-pointer">
            <Image src={"/icons/google.svg"} width={20} height={20} alt="google" />
            Sign up with google
        </Button>
    )
}

export default OAuth
