import DbWalker from "dbwalker";
import md5 from "md5";

const db = new DbWalker();

const getUser = async (params = {}) => {

    const where = [];
    if (params.id) where.push(`id = ${params.id}`);
    if (params.name) where.push(`name = '${params.name}'`);
    if (params.email) where.push(`email = '${params.email}'`);
    if (params.passwd) where.push(`passwd = '${params.passwd}'`);

    const users = await db.select({table: 'users', where}).query();
    return users;
}

export const geturlparams = (req) => {
    const url = new URL(req.url);
    const returnParams = {};
    for (const [key, value] of url.searchParams)
        returnParams[key] = value;
    return returnParams;
}

export async function GET(req) {
    const users = await getUser(geturlparams(req) ?? {})
    return new Response(JSON.stringify(users));
}

export async function POST(req) {
    const payload = await req.json();
    const user_exists = await getUser({
        email: payload.email,
    });
    if (user_exists.length > 0) {
        return new Response(JSON.stringify({error: 'Usuário já existe'}), {status: 400});
    }
    const user = await db.insert({table: 'users', data: [payload]}).query();
    return new Response(user.insertId ? JSON.stringify({id: user.insertId, ...payload}) : JSON.stringify({error: 'error'}));
}