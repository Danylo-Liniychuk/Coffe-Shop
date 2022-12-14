import React from "react";
import {useState, useEffect} from 'react';
import {IoMdClose, IoIosClose} from 'react-icons/io';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

const BasketModal = ({props}) => {
    const [orderPrice, setOrderPrice] = useState(0);
    const {setBasketVision, setBasketData, basketData, basketVision} = props;
    const onCloseModal = () => {
        setBasketVision(false);
        setOrderPrice(0);
    }

    useEffect(()=> {
        if (basketVision === false) {
        }
        else {
            let total = 0;
            basketData.forEach(item => {
                total += +item.price.replace(',', '.')
            });
            setOrderPrice(total.toFixed(2));
        }
    }, [basketVision]);


    return (
            <CSSTransition
            in={basketVision}
            timeout={1000}
            classNames="modalTransition"
            unmountOnExit>
                <div className={(basketVision) ? "layout" : "layout layout-hidden"}>
                    <div className="basketModal">
                        <h2>Your basket</h2>
                        <div onClick={onCloseModal} className="modal__close"><IoMdClose id='close'/></div>
                        <div className="basketModal__line"></div>
                        {(basketData.length === 0) ? <div className="basketModal__empty">Your shopping cart is empty</div> : null}
                        <TransitionGroup component={'ul'}>
                            {basketData.map((item) => (
                                <CSSTransition
                                key={item.id}
                                timeout={500}
                                classNames='listItem'
                                >
                                    <ListItem props={{src:item.src,
                                             name:item.name,
                                             price:item.price,
                                             id:item.id,
                                             basketData,
                                             setBasketData,
                                             setOrderPrice,
                                             orderPrice}}/>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                        <div className="basketModal__checkout">
                            <div className="basketModal__order">Order price: {orderPrice}$</div>
                            <button className="button button-checkout">Checkout</button>
                        </div>
                    </div>
                </div>
            </CSSTransition>
    )
}

const ListItem = ({props}) => {
    const {src, name, price, id, basketData, setBasketData, setOrderPrice, orderPrice} = props;
    const [amount, setAmount] = useState(1);
    
    const handleChange = (e) => {
        const value = e.target.value;
        if(value < amount) {
            setOrderPrice((+orderPrice - ((amount - value) * +price.replace(',', '.'))).toFixed(2));
            setAmount(value);
            
        } else {
            setOrderPrice(+orderPrice + ((value - amount) * +price.replace(',', '.')));
            setAmount(value);
        }
        
    };
    return (
        <li key={id}>
            <img src={src} alt="coffe" />
            <div>
                <div className="basketModal__name">{name}</div>
                <input onChange={handleChange} value={amount} type="number" min='1' placeholder="Amount" />
                <div className="basketModal__price">{(price.replace(',', '.') * amount).toFixed(2)}$</div>
            </div>
            <div onClick={() => {
                setOrderPrice((+orderPrice - (amount * +price.replace(',', '.'))).toFixed(2))
                setBasketData(basketData.filter(list => list.id !== id))}} className="basketModal__close"><IoIosClose data-key={id}/></div>
        </li>
    )
}

export default BasketModal;