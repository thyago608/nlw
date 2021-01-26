import React, {SelectHTMLAttributes } from 'react';
import './style.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>{
    name:string;
    label:string;
    options: Array<{
        label:string
        value:string;
    }>;
}

const Select:React.FC<SelectProps> = ({name, label, options, ...rest}) =>{
    return (
        <div className="select-block">
        <label htmlFor={name}>{label}</label>
        <select id={name} {...rest}>
            <option hidden value="" > Selecione uma opção</option>

            { options.map(option =>{
                return <option key={option.value} value={option.value}>{option.label}</option>
            }) }
        </select>
      </div>
    );
}

export default Select;