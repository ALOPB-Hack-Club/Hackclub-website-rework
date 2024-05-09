export async function GET({ params }: any){
    return new Response(JSON.stringify(await fetch('https://hackathons.hackclub.com/api/events/all').then(res => res.json())));
}