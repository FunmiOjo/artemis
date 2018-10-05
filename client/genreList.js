const genreList = {
genres: [
{
name: "VR & AR",
id: 139,
parent_id: 127
},
{
name: "Web Design",
id: 140,
parent_id: 127
},
{
name: "Golf",
id: 141,
parent_id: 77
},
{
name: "English Learning",
id: 142,
parent_id: 116
},
{
name: "Programming",
id: 143,
parent_id: 127
},
{
name: "Personal Finance",
id: 144,
parent_id: 67
},
{
name: "Parenting",
id: 145,
parent_id: 132
},
{
name: "LGBTQ",
id: 146,
parent_id: 122
},
{
name: "SEO",
id: 147,
parent_id: 97
},
{
name: "American History",
id: 148,
parent_id: 125
},
{
name: "Venture Capital",
id: 149,
parent_id: 93
},
{
name: "Movie",
id: 138,
parent_id: 68
},
{
name: "Chinese History",
id: 150,
parent_id: 125
},
{
name: "Locally Focused",
id: 151,
parent_id: 67
},
{
name: "San Francisco Bay Area",
id: 154,
parent_id: 152
},
{
name: "Denver",
id: 155,
parent_id: 152
},
{
name: "Startup",
id: 157,
parent_id: 93
},
{
name: "NFL",
id: 158,
parent_id: 78
},
{
name: "Harry Potter",
id: 159,
parent_id: 68
},
{
name: "Game of Thrones",
id: 162,
parent_id: 68
},
{
name: "Storytelling",
id: 165,
parent_id: 122
},
{
name: "YouTube",
id: 166,
parent_id: 68
},
{
name: "Other Games",
id: 83,
parent_id: 82
},
{
name: "Automotive",
id: 84,
parent_id: 82
},
{
name: "Video Games",
id: 85,
parent_id: 82
},
{
name: "Hobbies",
id: 86,
parent_id: 82
},
{
name: "Aviation",
id: 87,
parent_id: 82
},
{
name: "United States",
id: 152,
parent_id: 151
},
{
name: "China",
id: 156,
parent_id: 151
},
{
name: "Star Wars",
id: 160,
parent_id: 68
},
{
name: "AI & Data Science",
id: 163,
parent_id: 127
},
{
name: "Podcasts",
id: 67,
parent_id: null
},
{
name: "TV & Film",
id: 68,
parent_id: 67
},
{
name: "Religion & Spirituality",
id: 69,
parent_id: 67
},
{
name: "Spirituality",
id: 70,
parent_id: 69
},
{
name: "Islam",
id: 71,
parent_id: 69
},
{
name: "Buddhism",
id: 72,
parent_id: 69
},
{
name: "Judaism",
id: 73,
parent_id: 69
},
{
name: "Other",
id: 74,
parent_id: 69
},
{
name: "Christianity",
id: 75,
parent_id: 69
},
{
name: "Hinduism",
id: 76,
parent_id: 69
},
{
name: "Sports & Recreation",
id: 77,
parent_id: 67
},
{
name: "Professional",
id: 78,
parent_id: 77
},
{
name: "Outdoor",
id: 79,
parent_id: 77
},
{
name: "College & High School",
id: 80,
parent_id: 77
},
{
name: "Amateur",
id: 81,
parent_id: 77
},
{
name: "Games & Hobbies",
id: 82,
parent_id: 67
},
{
name: "Health",
id: 88,
parent_id: 67
},
{
name: "Fitness & Nutrition",
id: 89,
parent_id: 88
},
{
name: "Self-Help",
id: 90,
parent_id: 88
},
{
name: "Alternative Health",
id: 91,
parent_id: 88
},
{
name: "Sexuality",
id: 92,
parent_id: 88
},
{
name: "Business",
id: 93,
parent_id: 67
},
{
name: "Careers",
id: 94,
parent_id: 93
},
{
name: "Business News",
id: 95,
parent_id: 93
},
{
name: "Shopping",
id: 96,
parent_id: 93
},
{
name: "Management & Marketing",
id: 97,
parent_id: 93
},
{
name: "Investing",
id: 98,
parent_id: 93
},
{
name: "News & Politics",
id: 99,
parent_id: 67
},
{
name: "Arts",
id: 100,
parent_id: 67
},
{
name: "Performing Arts",
id: 101,
parent_id: 100
},
{
name: "Food",
id: 102,
parent_id: 100
},
{
name: "Visual Arts",
id: 103,
parent_id: 100
},
{
name: "Literature",
id: 104,
parent_id: 100
},
{
name: "Design",
id: 105,
parent_id: 100
},
{
name: "Fashion & Beauty",
id: 106,
parent_id: 100
},
{
name: "Science & Medicine",
id: 107,
parent_id: 67
},
{
name: "Social Sciences",
id: 108,
parent_id: 107
},
{
name: "Medicine",
id: 109,
parent_id: 107
},
{
name: "Natural Sciences",
id: 110,
parent_id: 107
},
{
name: "Education",
id: 111,
parent_id: 67
},
{
name: "Educational Technology",
id: 112,
parent_id: 111
},
{
name: "Higher Education",
id: 113,
parent_id: 111
},
{
name: "K-12",
id: 114,
parent_id: 111
},
{
name: "Training",
id: 115,
parent_id: 111
},
{
name: "Language Courses",
id: 116,
parent_id: 111
},
{
name: "Government & Organizations",
id: 117,
parent_id: 67
},
{
name: "Local",
id: 118,
parent_id: 117
},
{
name: "Crypto & Blockchain",
id: 136,
parent_id: 127
},
{
name: "True Crime",
id: 135,
parent_id: 122
},
{
name: "Non-Profit",
id: 119,
parent_id: 117
},
{
name: "Regional",
id: 120,
parent_id: 117
},
{
name: "National",
id: 121,
parent_id: 117
},
{
name: "Society & Culture",
id: 122,
parent_id: 67
},
{
name: "Places & Travel",
id: 123,
parent_id: 122
},
{
name: "Personal Journals",
id: 124,
parent_id: 122
},
{
name: "Philosophy",
id: 126,
parent_id: 122
},
{
name: "Software How-To",
id: 128,
parent_id: 127
},
{
name: "Podcasting",
id: 129,
parent_id: 127
},
{
name: "Gadgets",
id: 130,
parent_id: 127
},
{
name: "Tech News",
id: 131,
parent_id: 127
},
{
name: "Kids & Family",
id: 132,
parent_id: 67
},
{
name: "Comedy",
id: 133,
parent_id: 67
},
{
name: "Music",
id: 134,
parent_id: 67
},
{
name: "New York",
id: 153,
parent_id: 152
},
{
name: "Star Trek",
id: 161,
parent_id: 68
},
{
name: "Apple",
id: 164,
parent_id: 127
},
{
name: "History",
id: 125,
parent_id: 122
},
{
name: "NBA",
id: 137,
parent_id: 78
},
{
name: "Technology",
id: 127,
parent_id: 67
},
{
name: "Audio Drama",
id: 167,
parent_id: 122
},
{
name: "Fiction",
id: 168,
parent_id: 122
}
]
}

export default genreList
