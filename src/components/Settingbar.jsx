import React from 'react';
import toolState from '../store/toolState';
import '../styles/toolbar.scss';

const Settingbar = () => {
  return (
    <div className='setting-bar'>
        <label htmlFor='line-width'>Толщина линии</label>
        <input id='line-width' type='number'
               onChange={e => toolState.setLineWidth(e.target.value)}
               defaultValue={1} min={1} max={20}/>
        <label htmlFor='stroke-color'>Цвет обводки</label>
        <input onChange={e => toolState.setStrokeColor(e.target.value)} id='stroke-color' type='color'/>
    </div>
  )
}

export default Settingbar