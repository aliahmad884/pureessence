"use client"
import FallBackLoader from "@/components/loader";
import { useDataContext } from "@/context";
import countreis from "@/countryWithCode";
import { strGen } from "@/options";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function Shipping() {
    const { loggedUser } = useDataContext()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [address, setAddress] = useState('')
    const [country, setCountry] = useState('United Kingdom')
    const [city, setCity] = useState('')
    const [phone, setPhone] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const calculateAmout = (item) => {
        let arr = []
        item.forEach(ele => {
            arr.push(Number(ele.price) * ele.qty)
        });
        let amount = 0;
        for (let i = 0; i < arr.length; i++) {
            amount = amount + arr[i]
        }
        return amount;
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        localStorage.removeItem('billingInfo')
        const uniqueId = strGen(25)
        const body = {
            email: loggedUser ? loggedUser.Email : email,
            firstName: firstName,
            lastName: lastName,
            address: address,
            country: country,
            city: city,
            phone: phone,
            // total: amount
        }
        localStorage.setItem('billingInfo', JSON.stringify(body))
        localStorage.setItem('uniqueId', uniqueId)


        router.push(`/checkout?huihbc=hdhdiusbdhwyd&uniqueId=${uniqueId}`)
    }
    useEffect(() => {
        setIsLoading(false)
    }, [])
    // useEffect(() => {
    //     const storedBillInfo = localStorage.getItem('userBillInfo')
    //     if (loggedUser) {
    //         if (storedBillInfo) {
    //             let ask = confirm('We found an default billing address, you want to use this or add a new one?You can preview your address on checkout and change, if needed');
    //             if (ask) {
    //                 console.log(JSON.parse(storedBillInfo))
    //                 localStorage.setItem('billingInfo', JSON.stringify(JSON.parse(storedBillInfo)))
    //                 router.push('/checkout')
    //             }
    //         }
    //     }
    // }, [loggedUser]);
    if (isLoading) return <FallBackLoader />
    return (
        <>
            <div className="checkoutForm" onSubmit={handleSubmit}>
                <form id="billingForm">
                    <h1>Shipping Details</h1>
                    {/* <label htmlFor="country">Country</label> */}
                    <select name="country" id="country" onChange={(e) => setCountry(e.target.value)} required autoComplete="country" defaultValue={'United Kingdom'}>
                        {
                            countreis.map((country, index) => <option key={index} value={country.name}>{country.name}</option>)
                        }
                    </select>
                    <div className="nameCont">
                        <div style={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
                            {/* <label htmlFor="firstName">First Name</label> */}
                            <input type="text" onChange={(e) => setFirstName(e.target.value)} name="firstName" id="firstName" placeholder="First Name" required autoComplete="given-name" />
                        </div>
                        <div style={{ display: 'flex', flexFlow: 'column', width: '100%' }}>
                            {/* <label htmlFor="lastName">Last Name</label> */}
                            <input type="text" onChange={(e) => setLastName(e.target.value)} name="lastName" id="lastName" placeholder="LastName" required autoComplete="family-name" />
                        </div>
                    </div>
                    {/* <label htmlFor="address">Address</label> */}
                    <input type="text" onChange={(e) => setAddress(e.target.value)} name="address" id="address" placeholder="Address" required autoComplete="address-line1" />
                    {/* <label htmlFor="city">City</label> */}
                    <input type="text" onChange={(e) => setCity(e.target.value)} name="city" id="city" required placeholder="City" autoComplete="address-level2" />
                    {/* <label htmlFor="phone">Phone</label> */}
                    <input type="tel" onChange={(e) => setPhone(e.target.value)} name="phone" id="phone" required placeholder="Phone Number" autoCapitalize="tel" />
                    {/* <label htmlFor="email">Email</label> */}
                    <input type="email" onChange={(e) => setEmail(e.target.value)} value={loggedUser ? loggedUser.Email : email} name="email" id="email" required autoComplete="email" placeholder="Email" />
                    <div className="btnCont">
                        <Link href={'/cart'}>Back to cart</Link>
                        <button className="btnNext" type="submit">Next</button>
                    </div>
                </form>
            </div>
        </>
    )
}