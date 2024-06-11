import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: 'Stephen Paul',
        email: 'stephensimonpaul@gmail.com',
        image: 'https://avatars.githubusercontent.com/u/10000000?v=4',
      }
    ]
  });
  const now = new Date();
  await prisma.note.createMany({
    data: [
      {
        text: 'FTC commissioners are often given cushy jobs at private firms because of the leverage they provide. Between 1940-1980 the increase in value workers provided grew proportionally to their wages. 1980 marks the beginning of a trend where productivity went up 75% while wages went up by 5%. GDP per capita is therefor not a good indicator of worker welfare.  In the Unites States, the number of publicly traded companies has been halved while in other developed countries, it has increased by 50%.',
        dateUpdated: new Date('2022-01-01'),
        userId: 1,
        dateCreated: now,
      },
      {
        text: 'Definitions of Monopolies are highly technical and hard to prove until the damage has already been done. The Neoclassical economics ideal needs to be abandoned in favour of even distribution of power and fairness.',
        dateUpdated: new Date('2023-01-01'),
        userId: 1,
        dateCreated: now,
      },
      {
        text: 'Chokepoints describe an hourglass-shaped market where there are consumers on one end and producers of value on the other, with rentiers in the middle. A rentier makes their income by owning capital.',
        dateUpdated: new Date('2023-02-01'),
        userId: 1,
        dateCreated: now,
      },
      {
        text: 'Some publishers are left with as little as 40% after Amazon takes its cut. And that 40% goes to the Author, an editor, market, printing, shipping.',
        dateUpdated: new Date('2023-02-10'),
        userId: 1,
        dateCreated: now,
      },
      {
        text: 'DRM is ostensibly used to protect authors and publishers from having their work stolen, but in fact, it harms them.',
        dateUpdated: new Date('2022-03-20'),
        userId: 1,
        dateCreated: now,
      },
      {
        text: 'Copywrite shifted power aware from creators to the platform because the platform became the enforcer and controlled how the lock functioned. The copywrite was entirely defined and enforced by the platform. ',
        dateUpdated: new Date('2022-04-01'),
        userId: 1,
        dateCreated: now,
      },
      {
        text: 'DRM was actually IP which could not be sold to third parties. Apple did this with the iPod. One easy solution to this would be to permit music to be transferred to competing platforms!',
        dateUpdated: new Date('2022-04-10'),
        userId: 1,
        dateCreated: now,
      },
      {
        text: 'Capitalism (like Communism) has a natural tendency toward monopoly. Peter Thiel pronounced that "competition is for losers" and MBAs are taught to avoid competitive industries. Warren Buffet looks for industries with Moats which prevent competition from entering. Chokepoints are created between producers and consumers to extract value from others work.',
        dateUpdated: new Date('2022-05-01'),
        userId: 1,
        dateCreated: now,
      }
    ]
  });
  const synonymOne = await prisma.synonym.create({
    data: {}
  });
  const synonymTwo = await prisma.synonym.create({
    data: {}
  });
  const synonymThree = await prisma.synonym.create({
    data: {}
  });
  await prisma.tag.create({
    data: {
      text: 'one',
      synonymId: synonymOne.id,
      userId: 1,
      dateCreated: now,
    }
  });
  await prisma.tag.create({
    data: {
      text: 'two',
      synonymId: synonymOne.id,
      userId: 1,
      dateCreated: now,
    }
  });
  await prisma.tag.create({
    data: {
      text: 'three',
      synonymId: synonymOne.id,
      userId: 1,
      dateCreated: now,
    }
  });
  await prisma.tag.create({
    data: {
      text: 'four',
      synonymId: synonymTwo.id,
      userId: 1,
      dateCreated: now,
    }
  });
  await prisma.tag.create({
    data: {
      text: 'five',
      synonymId: synonymTwo.id,
      userId: 1,
      dateCreated: now,
    }
  });
  await prisma.tag.create({
    data: {
      text: 'six',
      synonymId: synonymTwo.id,
      userId: 1,
      dateCreated: now,
    }
  });
  await prisma.tag.create({
    data: {
      text: 'seven',
      synonymId: synonymThree.id,
      userId: 1,
      dateCreated: now,
    }
  });
  await prisma.tag.create({
    data: {
      text: 'eight',
      synonymId: synonymThree.id,
      userId: 1,
      dateCreated: now,
    }
  });
  const groupOne = await prisma.group.create({
    data: {
      name: 'group one',
      userId: 1,
    }
  });
  const groupTwo = await prisma.group.create({
    data: {
      name: 'group two',
      userId: 1,
    }
  });
  await prisma.synonymGroup.create({
    data: {
      groupId: groupOne.id,
      synonymId: synonymOne.id
    }
  });
  await prisma.synonymGroup.create({
    data: {
      groupId: groupOne.id,
      synonymId: synonymTwo.id
    }
  });
  await prisma.synonymGroup.create({
    data: {
      groupId: groupOne.id,
      synonymId: synonymThree.id
    }
  });
  await prisma.synonymGroup.create({
    data: {
      groupId: groupTwo.id,
      synonymId: synonymOne.id
    }
  });
  await prisma.synonymGroup.create({
    data: {
      groupId: groupTwo.id,
      synonymId: synonymTwo.id
    }
  });
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