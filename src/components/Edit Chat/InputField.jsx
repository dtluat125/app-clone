import React, { useState } from 'react'

function InputField({fieldLabel, required, hyphenized, onChange, value, disabled}) {
    
    return (
        <div className="input-field form-group">
            <label htmlFor="name-input" className="form-label"><strong>{fieldLabel}</strong></label>
            <input disabled={disabled} value = {value} onChange = {onChange} type="text" className="form-control" required={required?required:""}/>
        </div>
    )
}

export default InputField
