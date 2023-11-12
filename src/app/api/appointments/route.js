import DbWalker from "dbwalker";

export const geturlparams = (req) => {
    const url = new URL(req.url);
    const returnParams = {};
    for (const [key, value] of url.searchParams)
        returnParams[key] = value;
    return returnParams;
}


const db = new DbWalker();

const getAppointments = async (params = {}) => {

    const where = [];
    if (params.id) where.push(`id = ${params.id}`);
    if (params.user_id) where.push(`user_id = ${params.user_id}`);
    if (params.pacient_document) where.push(`pacient_document = '${params.pacient_document}'`);
    if (params.pacient_name) where.push(`pacient_name = '${params.pacient_name}'`);
    if (params.appointment_date) where.push(`appointment_date = '${params.appointment_date}'`);

    const appointments = await db.select({
        table: 'appointments',
        where,
        order_by: 'appointment_date DESC'
    }).query();
    return appointments;
}

export async function GET(req) {
    const appointments = await getAppointments(geturlparams(req) ?? {})
    return new Response(JSON.stringify(appointments));
}

export async function POST(req) {
    try {
    const payload = await req.json();
    const save_appointment = await db.insert({table: 'appointments', data: [payload]}).query();
    return new Response(save_appointment.insertId ? JSON.stringify({id: save_appointment.insertId, ...payload}) : JSON.stringify({error: 'error'}));
    }  catch (e) {
        console.log(e);
        return new Response(JSON.stringify({error: 'error'}), {status: 500});
    }
}

export async function PUT(req) {
    const payload = await req.json();
    const update_appointment = await db.update({table: 'appointments', data: payload, where: `id = ${payload.id}`}).query();
    return new Response(update_appointment.affectedRows ? JSON.stringify({id: payload.id, ...payload}) : JSON.stringify({error: 'error'}));
}