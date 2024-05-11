
// ***************************************************************
// ******************** BEGIN section to edit ********************
// ***************************************************************

/* ***********************************************************************************
   * 
   *  Version options: 
   * 
   *  kjv       King James Version
   *  nkjv      New King James Version
   *  nlt       New Living Translation
   *  niv       New International Version
   *  esv       English Standard Version
   *  csb       Christian Standard Bible
   *  nasb20    New American Standard Bible 2020
   *  nasb95    New American Standard Bible 1995
   *  lsb       Legacy Standard Bible
   *  net       New English Translation
   *  rsv       Revised Standard Version
   *  asv       American Standard Version
   *  ylt       Young's Literal Translation
   *  dby       Darby Translation
   *  web       Webster's Bible
   *  hnv       Hebrew Names Version
   *
   *********************************************************************************** */

// This is simply the link from the address bar while in the doc. 
// Your account must have access to edit the doc.
var doc_link = "??"; // fill in
var bible_version = "??"; // fill in

// ***************************************************************
// ******************** END section to edit **********************
// ***************************************************************



// ******************** Data ********************

const books = [
  {num: 1, names: ["Genesis", "Ge", "Gen"], blb: "gen", len: 50}, 
  {num: 2, names: ["Exodus", "Ex", "Exo"], blb: "exo", len: 40}, 
  {num: 3, names: ["Leviticus", "Le", "Lev"], blb: "lev", len: 27}, 
  {num: 4, names: ["Numbers", "Nu", "Num"], blb: "num", len: 36}, 
  {num: 5, names: ["Deuteronomy", "De", "Deut"], blb: "deu", len: 34}, 
  {num: 6, names: ["Joshua", "Jos", "Josh"], blb: "jos", len: 24}, 
  {num: 7, names: ["Judges", "Jg", "Judg"], blb: "jdg", len: 21}, 
  {num: 8, names: ["Ruth", "Ru"], blb: "rth", len: 4}, 
  {num: 9, names: ["1 Samuel", "1st Samuel", "1Sa", "1 Sa", "1 Sam", "1st Sam"], blb: "1sa", len: 31}, 
  {num: 10, names: ["2 Samuel", "2nd Samuel", "2Sa", "2 Sa", "2 Sam", "2nd Sam"], blb: "2sa", len: 24}, 
  {num: 11, names: ["1 Kings", "1Ki", "1 Ki", "1st Kings", "1 King"], blb: "1ki", len: 22}, 
  {num: 12, names: ["2 Kings", "2Ki", "2 Ki", "2nd Kings", "2 King"], blb: "2ki", len: 25}, 
  {num: 13, names: ["1 Chronicles", "1st Chronicles", "1Ch", "1 Ch", "1 Chron", "1st Chron"], blb: "1ch", len: 29}, 
  {num: 14, names: ["2 Chronicles", "2nd Chronicles", "2Ch", "2 Ch", "2 Chron", "2nd Chron"], blb: "2ch", len: 36}, 
  {num: 15, names: ["Ezra", "Ezr", "Ez"], blb: "ezr", len: 10}, 
  {num: 16, names: ["Nehemiah", "Ne", "Neh"], blb: "neh", len: 13}, 
  {num: 17, names: ["Esther", "Es", "Est", "Esth"], blb: "est", len: 10}, 
  {num: 18, names: ["Job"], blb: "job", len: 42}, 
  {num: 19, names: ["Psalm", "Psalms", "Ps", "Psa"], blb: "psa", len: 150}, 
  {num: 20, names: ["Proverbs", "Pr", "Pro", "Prov"], blb: "pro", len: 31}, 
  {num: 21, names: ["Ecclesiastes", "Ec", "Ecc", "Eccl"], blb: "ecc", len: 12}, 
  {num: 22, names: ["Song of Solomon", "Song", "Song of Sol"], blb: "sng", len: 8}, 
  {num: 23, names: ["Isaiah", "Is", "Isa"], blb: "isa", len: 66}, 
  {num: 24, names: ["Jeremiah", "Jer"], blb: "jer", len: 52}, 
  {num: 25, names: ["Lamentations", "Lam", "La"], blb: "lam", len: 5}, 
  {num: 26, names: ["Ezekiel", "Ez", "Eze", "Ezek"], blb: "eze", len: 48}, 
  {num: 27, names: ["Daniel", "Da", "Dan"], blb: "dan", len: 12}, 
  {num: 28, names: ["Hosea", "Ho", "Hos"], blb: "hos", len: 14}, 
  {num: 29, names: ["Joel", "Joe"], blb: "joe", len: 3}, 
  {num: 30, names: ["Amos", "Am"], blb: "amo", len: 9}, 
  {num: 31, names: ["Obadiah", "Ob", "Obad"], blb: "oba", len: 1}, 
  {num: 32, names: ["Jonah", "Jon"], blb: "jon", len: 4}, 
  {num: 33, names: ["Micah", "Mic"], blb: "mic", len: 7}, 
  {num: 34, names: ["Nahum", "Na", "Nah"], blb: "nah", len: 3}, 
  {num: 35, names: ["Habakkuk", "Hab"], blb: "hab", len: 3}, 
  {num: 36, names: ["Zephaniah", "Zep", "Zeph"], blb: "zep", len: 3}, 
  {num: 37, names: ["Haggai", "Hag"], blb: "hag", len: 2}, 
  {num: 38, names: ["Zechariah", "Zec", "Zech"], blb: "zec", len: 14}, 
  {num: 39, names: ["Malachi", "Mal"], blb: "mal", len: 4}, 
  {num: 40, names: ["Matthew", "Mt", "Matt"], blb: "mat", len: 28}, 
  {num: 41, names: ["Mark", "Mk"], blb: "mar", len: 16}, 
  {num: 42, names: ["Luke", "Lu", "Lk"], blb: "luk", len: 24}, 
  {num: 43, names: ["John", "Joh", "Jhn", "Jn"], blb: "jhn", len: 21}, 
  {num: 44, names: ["Acts", "Act"], blb: "act", len: 28}, 
  {num: 45, names: ["Romans", "Ro", "Rom"], blb: "rom", len: 16}, 
  {num: 46, names: ["1 Corinthians", "1st Corinthians", "1Co", "1 Co", "1 Cor", "1st Cor"], blb: "1co", len: 16}, 
  {num: 47, names: ["2 Corinthians", "2nd Corinthians", "2Co", "2 Co", "2 Cor", "2nd Cor"], blb: "2co", len: 13}, 
  {num: 48, names: ["Galatians", "Ga", "Gal"], blb: "gal", len: 6}, 
  {num: 49, names: ["Ephesians", "Eph"], blb: "eph", len: 6}, 
  {num: 50, names: ["Philippians", "Php", "Phil"], blb: "phl", len: 4}, 
  {num: 51, names: ["Colossians", "Col"], blb: "col", len: 4}, 
  {num: 52, names: ["1 Thessalonians", "1st Thessalonians", "1Th", "1 Th", "1 Thess", "1st Thess"], blb: "1th", len: 5}, 
  {num: 53, names: ["2 Thessalonians", "2nd Thessalonians", "2Th", "2 Th", "2 Thess", "2nd Thess"], blb: "2th", len: 3}, 
  {num: 54, names: ["1 Timothy", "1st Timothy", "1Ti", "1 Ti", "1 Tim", "1st Tim"], blb: "1ti", len: 6}, 
  {num: 55, names: ["2 Timothy", "2nd Timothy", "2Ti", "2 Ti", "2 Tim", "2nd Tim"], blb: "2ti", len: 4}, 
  {num: 56, names: ["Titus", "Tit"], blb: "tit", len: 3}, 
  {num: 57, names: ["Philemon", "Phm", "Philem", "Phile"], blb: "phm", len: 1}, 
  {num: 58, names: ["Hebrews", "Heb"], blb: "heb", len: 13}, 
  {num: 59, names: ["James", "Ja", "Jam", "Jas"], blb: "jas", len: 5}, 
  {num: 60, names: ["1 Peter", "1st Peter", "1Pe", "1 Pe", "1 Pet", "1st Pet"], blb: "1pe", len: 5}, 
  {num: 61, names: ["2 Peter", "2nd Peter", "2Pe", "2 Pe", "2 Pet", "2nd Pet"], blb: "2pe", len: 3}, 
  {num: 62, names: ["1 John", "1st John", "1Jo", "1 Jo", "1 Jhn", "1st Jhn"], blb: "1jo", len: 5}, 
  {num: 63, names: ["2 John", "2nd John", "2Jo", "2 Jo", "2 Jhn", "2nd Jhn"], blb: "2jo", len: 1}, 
  {num: 64, names: ["3 John", "3rd John", "3Jo", "3 Jo", "3 Jhn", "3rd Jhn"], blb: "3jo", len: 1}, 
  {num: 65, names: ["Jude", "Jd"], blb: "jde", len: 1}, 
  {num: 66, names: ["Revelation", "Re", "Rev"], blb: "rev", len: 22}
];
const single_chapter_bible_nums = [31, 57, 63, 64, 65];

// ******************** Variables ********************

var current_book_name = "Genesis";
var current_book = books[0];
var reference_start_pos = 0;
var chapter = 1;
var verse_start = 1;
var verse_end = 1;
var doc, body, search_string, search_field, search_result, search_result_element;


// ******************** Utility functions ********************

function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  doc = DocumentApp.openByUrl(doc_link);
  body = doc.getBody()
  link();
}


// ******************** Linker functions ********************

function link() {
  for (let i = 0; i < 66; i++) {
    current_book = books[i];
    for (let j = 0; j < current_book.names.length; j++) {
      current_book_name = current_book.names[j];
      search();
    }
  }

  return true; 
}


function search() {
  search_string = "(?i)" + current_book_name + "\.? ([0-9]+:?([0-9;:,-]?)+ ?)+";
  search_field = doc.getBody();
  search_result = search_field.findText(search_string);

  while (search_result != null) {
    var search_result_start = search_result.getStartOffset();
    var search_result_end = search_result.getEndOffsetInclusive();
    reference_start_pos = search_result_start;

    search_result_element = search_result.getElement().asText(); // element is what the link attaches to
    var reference_string = search_result_element.getText().slice(search_result_start, search_result_end + 1);

    // TODO: check if the reference is already linked and if so move on to the next reference (may need to do this in a deeper function in case a verse is added on to the end of the reference or something like that)

    references = split_references(reference_string);
    references.forEach(parse_reference);

    // find the next match
    search_result = search_field.findText(search_string, search_result);
  }
}


// ******************** Helper functions ********************

function split_references(reference_string) {
  // split up multiple references in a row
  // note: if a lone number comes after a comma, it is assumed to be another verse rather than another chapter
  var references_list = reference_string.split(';'); // split chapters
  var references = [];
  let last_end_pos = -1;

  // split by comma (verses)
  references_list.forEach((ref) => {
    let sub_refs = ref.split(',');

    // count and trim whitespace
    let whitespace = 0;
    while (sub_refs[0][whitespace] == ' ') whitespace++;
    sub_refs[0] = sub_refs[0].trim();
    // push the first of the split list
    references.push({
      ref: sub_refs[0],
      start_pos: last_end_pos + 1 + whitespace,
      end_pos: last_end_pos + 1 + whitespace + sub_refs[0].length,
      after_comma: false
    });
    last_end_pos = references[references.length-1].end_pos;

    // if there are still more verses push them as additional
    for (let i = 1; i < sub_refs.length; i++) {
      let whitespace = 0;
      while (sub_refs[i][whitespace] == ' ') whitespace++;
      sub_refs[i] = sub_refs[i].trim();
      references.push({
        ref: sub_refs[i],
        start_pos: last_end_pos + 1 + whitespace,
        end_pos: last_end_pos + 1 + whitespace + sub_refs[i].length,
        after_comma: true
      });
      last_end_pos = references[references.length-1].end_pos;
    }
  });

  // take out :, -, and / that are at the end of any references
  for (let i = 0; i < references.length; i++) {
    if (references[i].ref.endsWith(":") || references[i].ref.endsWith("-") || references[i].ref.endsWith("/")) {
      references[i].ref = references[i].ref.slice(0,-1);
    }
  }

  // take out the book name from the first reference
  references[0].ref = references[0].ref.trim();
  let index = references[0].ref.length;
  for (let i = references[0].ref.length - 1; i > 0; i--) {
    if (!((references[0].ref[i] >= '0' && references[0].ref[i] <= '9') || references[0].ref[i] == ':' || references[0].ref[i] == '-')) {
      index = i + 1;
      break;
    }
  }
  references[0].ref = references[0].ref.slice(index).trim();

  return references;
}


function parse_reference(reference) {
  let ref = reference.ref;

  if (ref == '') {
    return;
  }

  // set chapter
  if (reference.after_comma == true && !ref.includes(':')) {
    // chapter is already set from last reference, don't need to do anything
  } else if (single_chapter_bible_nums.includes(current_book.num)) {
    chapter = 1;
    if (ref.includes(':')) ref = ref.slice(ref.indexOf(':') + 1);
  } else {
    for (let i = 0; i < ref.length + 1; i++) {
      if (i == ref.length || ref[i] == ':' || ref[i] == '-' || ref[i] == ';') {
        chapter = ref.slice(0,i);
        if (i < ref.length && ref[i] == ':') {
          ref = ref.slice(i + 1); // take out the chapter so it's easier to find verses
        } else {
          ref = "";
        }
        break;
      }
    }
  }

  verse_start = 1;
  verse_end = 1;

  // set verses
  if (ref.length > 0) {
    if (ref.includes(':')) ref = ref.slice(ref.indexOf(':') + 1);
    if (ref.includes('-')) {
      verse_start = ref.slice(0, ref.indexOf('-'));
      verse_end = ref.slice(ref.indexOf('-') + 1);
    } else {
      verse_start = ref;
      verse_end = verse_start;
    }
  }

  if (chapter > current_book.len) {
    // probably a user typo or regex finding that's not actually a book and chapter
    return; 
  }

  // insert link
  let url = getURL(chapter, verse_start, verse_end);
  let start_pos = reference_start_pos + reference.start_pos;
  let end_pos = reference_start_pos + reference.end_pos - 1;
  search_result_element.setLinkUrl(start_pos, end_pos, url);
}


function getURL(chapter, verse_start, verse_end) {
  let url_head = "https://www.blueletterbible.org/";
  if (verse_end == verse_start) {
    return url_head + bible_version + '/' + current_book.blb + '/' + chapter + '/' + verse_start;
  } else {
    return url_head + bible_version + '/' + current_book.blb + '/' + chapter + '/' + verse_start + '-' + verse_end;
  }
}

