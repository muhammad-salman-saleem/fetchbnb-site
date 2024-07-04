import React, { useEffect, useState } from 'react';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { useRouter } from 'next/router';
import Script from 'next/script';

declare global {
    interface Window { rewardful: any; Rewardful: any; }
}

export async function getServerSideProps(context: any) {
    const isDemo = context?.query?.isDemo;
    if (isDemo) {
        return {
            props: {

            },
        }
    }
    const session: any = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions as any
    )
    const user: any = session?.user
    console.log("user from dashboard: ", user)
    console.log(user, 'user from index page')
    if (user === undefined) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }
    delete user.emailVerified;
    return {
        props: {
            user: user,
        },
    }
}

const Success: React.FC<any> = ({ user }) => {
    const router = useRouter();
    const [rewardful, setRewardful] = useState<any>();
    const customerId = router.query.customerid;
    useEffect(() => {
        window.rewardful = window.rewardful || {};
        window.rewardful('ready', () => {
            if (window.Rewardful.referral) {
                setRewardful({ referral: window.Rewardful.referral });
            }
            window.rewardful('convert', { email: user?.email });
            setTimeout(() => {
                router.push('/dashboard');
            }, 3500)
        })
    }, [])
    return (
        <>
            <Script id="tapsjngjfd" src="https://script.tapfiliate.com/tapfiliate.js" type="text/javascript" async />
            <Script
                id="tapfiliate"
                dangerouslySetInnerHTML={{
                    __html: `
                    (function(t,a,p){t.TapfiliateObject=a;t[a]=t[a]||function(){
                        (t[a].q=t[a].q||[]).push(arguments)}})(window,'tap');
                  
                        tap('create', '40671-48dd10', { integration: "stripe" });
                        tap('trial', ${customerId});
                    `,
                }} />
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span>Confirming... DO NOT close this tab... redirecting...</span>
            </div>
        </>
    )
}

export default Success;