"use client"

import FallBackLoader from "@/components/loader";
import { useDataContext } from "@/context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Completed() {
    const { setCartData, loggedUser } = useDataContext();
    const router = useRouter();
    const searchParams = useSearchParams();


    let count = 0
    useEffect(() => {
        count = count + 1
        console.log(count)
        const paymentIntentId = searchParams.get('payment_intent');
        const billingInfo = localStorage.getItem('billingInfo');
        const cartProducts = localStorage.getItem('cart');
        const userData = localStorage.getItem('user')
        const user = JSON.parse(userData)

        fetch(`/api/order?paymentIntentId=${paymentIntentId}`, {
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({ info: JSON.parse(billingInfo), products: JSON.parse(cartProducts) })
        })
        if (user) {
            fetch('/api/userCart?action=delAll', {
                method: 'delete',
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({ email: user.Email })
            })
        }
        localStorage.removeItem('cart')
        localStorage.removeItem('billingInfo')
        setCartData([])
        router.push('/')
    }, []);
    return (
        <>
            <FallBackLoader />
        </>
    );
}
