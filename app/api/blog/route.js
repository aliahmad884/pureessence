import { Blogs, Versions } from "../schemas.js";
import { getAdminToken, res, updateVersion } from "../syntaxShorter.js";

export async function POST(req) {
    let body = await req.json()
    try {
        if (body) {
            await Blogs.create({ ...body, date: Date.now() })
            updateVersion('blog', Versions)
            return res({ res: 'Blog Added Successfully!', }, 201)
        }
        return res({ res: "Blog Body Not Recieved!" }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}



export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const adminInfo = await getAdminToken(req);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const getVersion = searchParams.get('getVersion');
    const scope = searchParams.get('scope');

    const conditions = [];

    if (id) conditions.push({ id });
    if (slug) conditions.push({ bSlug: slug });

    try {
        if (getVersion) {
            const findVersion = await Versions.findOne({
                where: { key: getVersion }
            });

            if (!findVersion) {
                return res(
                    { res: `Version Not found against ${getVersion}` },
                    404
                );
            }

            return res(findVersion.dataValues, 200);
        }

        else if (scope === "customer") {
            if (conditions.length) {
                const findOne = await Blogs.findOne({
                    where: {
                        publish: true,
                        [Op.or]: conditions
                    }
                });

                if (!findOne) {
                    return res({ res: 'Blog Not found!' }, 404);
                }

                return res(findOne.dataValues, 200);
            }

            const blogs = await Blogs.findAll({
                where: { publish: true }
            });

            return res(
                blogs.map(blog => blog.dataValues),
                200
            );
        }

        else if (adminInfo && !scope) {
            if (conditions.length) {
                const findOne = await Blogs.findOne({
                    where: {
                        [Op.or]: conditions
                    }
                });

                if (!findOne) {
                    return res({ res: 'Blog Not found!' }, 404);
                }

                return res(findOne.dataValues, 200);
            }

            const blogs = await Blogs.findAll();

            return res(
                blogs.map(blog => blog.dataValues),
                200
            );
        }

        return res({ res: 'Unauthorized!' }, 401);

    } catch (err) {
        console.log(err);
        return res({ err: 'Internal Server Error!' }, 500);
    }
}



export async function PUT(req) {
    const body = await req.json()
    try {
        if (body) {
            console.log(body.id)
            const found = await Blogs.findByPk(body.id)
            console.log(found)
            if (found === null) return res({ res: `Blog Not found against id: ${body.id}` }, 404)
            else if (body.reason == "publish_status") {
                await Blogs.update({ publish: body.isPublish }, { where: { id: body.id } });
            }
            else {
                await Blogs.update(body, {
                    where: {
                        Id: body.id
                    }
                })
            }
            updateVersion('blog', Versions)
            return res({ res: 'Blog Updated Successfully!' }, 201)
        }
        return res({ res: "Blog Body Not Recieved!" }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}



export async function DELETE(req) {
    const { searchParams } = new URL(req.url)
    let id = searchParams.get('id')
    try {
        if (id) {
            const find = await Blogs.findByPk(id)
            if (find === null) return res({ res: `Blog Not found against param id: ${id}` }, 404)
            else {
                await find.destroy()
                updateVersion('blog', Versions)
                return res({ res: 'Blog Deleted Successfully against id: ' + id }, 201)
            }
        }
        return res({ res: 'Blog Data Not Found!' }, 404)
    }
    catch (err) {
        console.log(err);
        return res({ err: 'Internel Server Error!' }, 500)
    }
}
