import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})





async function main() {
    //   const arg = 'ip';
    //   const query = `SELECT n.id FROM "Note" n WHERE n.text ~* '\\m` + arg + `\\M';`;
    //   const noteIdsWithTag = await prisma.$queryRaw<number[]>(Prisma.sql`SELECT n.id FROM "Note" n WHERE n.text ~* CONCAT('\\m', ${arg}, '\\M');`);
    //       console.log(noteIdsWithTag);

    const r = await prisma.$queryRaw<number[]>(Prisma.sql`select sg.id from "SynonymGroup" sg where sg.id not in (select t."synonymId"  from "Tag" t);`);
    console.log('...', r);
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })




const text = 'FTC commissioners are often given cushy jobs at private firms because of the leverage they provide. Between 1940-1980 the increase in value workers provided grew proportionally to their wages. 1980 marks the beginning of a trend where productivity went up 75% while wages went up by 5%. GDP per capita is therefor not a good indicator of worker welfare.  In the Unites States, the number of publicly traded companies has been halved while in other developed countries, it has increased by 50%.';
const allTags = new Array(1000).fill(null).map((e, i) => ({ text: `word number ${i}`, id: i }));
const before = performance.now();
// allTags.filter(t => text.match(new RegExp(`\\b(${t.text})\\b`))).map(t => t.id);
allTags.filter(t => text.match(/\bhello\b/)).map(t => t.id);
console.log(performance.now() - before);


