// Diary data configuration file
// Used to manage data for the diary display page
const diaryModules = import.meta.glob('./diary/*.json', { eager: true });

export interface Moment {
    id: string;
    content: string;
    date: string;
    images?: string[];
}

export const moments: Moment[] = Object.entries(diaryModules).map(([path, mod]: [string, any]) => {
    const id = path.split('/').pop()?.replace('.json', '') || '';
    const data = mod.default as any;
    const moment: Moment = {
        id,
        ...data,
    };
    return moment;
});

// Sort moments by date in descending order
export const sortedMoments = [...moments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);export interface DiaryMoment {
    id: number;
    content: string;
    date: string; // ISO string
    images?: string[];
}

// export const moments: DiaryMoment[] = [
//     {
//         id: 2,
//         content: "今天记录点什么…… \n 🎄Merry Christmas! 欢迎来到2025年的圣诞之夜！ \n 这个日记还能增加图片，好玩",
//         date: "2025-12-25T05:00:00Z",
//         images: ["/assets/desktop-banner/136849820_p0.png",
//             "/assets/desktop-banner/124691157_p0.png"
//         ],
//     },
//     {
//         id: 1,
//         content: "The Darkest Hour Is Just Before The Dawn",
//         date: "2020-02-02T00:00:00Z",
//         images: [],
//     },
// ];
