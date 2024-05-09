export async function GET({ params }: any){
    return new Response(JSON.stringify(await fetch('https://hackathons.hackclub.com/api/events/upcoming').then(res => res.json())));
}