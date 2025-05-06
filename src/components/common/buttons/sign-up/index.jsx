import React from 'react'
import { useFormStatus } from "react-dom";
import "./style.scss"

const SignUpButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
        className='signup-btn'
        type='submit'
        >
        {pending ? (
				<div
					className="spinner-border spinner-border-sm text-secondary"
					role="status"
				>
					<span className="visually-hidden">Loading...</span>
				</div>
			) : (
				<>
					Sign up
				</>
			)}
    </button>
  )
}

export default SignUpButton