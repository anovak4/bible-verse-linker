
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
var bible_version = "nkjv";

// this is simply the link from the address bar while in the doc
// your account must have access to edit the doc
var doc_link = "https://docs.google.com/document/d/1v6A79P2zOSy1D-AIXvoBwU9bGg0Om-67BKBBCM_lUvo/edit#heading=h.pydjwtz7792";

// ***************************************************************
// ******************** END section to edit **********************
// ***************************************************************



// ******************** Data variables ********************

const book_names = [
  ["Genesis", "Ge", "Gen", "Gen."], 
  ["Exodus", "Ex", "Exo", "Ex.", "Exo."], 
  ["Leviticus", "Le", "Lev", "Lev."], 
  ["Numbers", "Nu", "Num", "Num."], 
  ["Deuteronomy", "De", "Deut", "Deut."], 
  ["Joshua", "Jos", "Josh", "Josh."], 
  ["Judges", "Jg", "Judg", "Judg."], 
  ["Ruth", "Ru", "Ru."], 
  ["1 Samuel", "1Sa", "1 Sam", "1 Sam."], 
  ["2 Samuel", "2Sa", "2 Sam", "2 Sam."], 
  ["1 Kings", "1Ki", "1 Ki", "1 Ki."], 
  ["2 Kings", "2Ki", "2 Ki", "2 Ki."], 
  ["1 Chronicles", "1Ch", "1 Chron", "1 Chron."], 
  ["2 Chronicles", "2Ch", "2 Chron", "2 Chron."], 
  ["Ezra", "Ezr", "Ez", "Ez."], 
  ["Nehemiah", "Ne", "Neh", "Neh."], 
  ["Esther", "Es", "Es.", "Est", "Est."], 
  ["Job"], 
  ["Psalm", "Psalms", "Ps", "Ps.", "Psa", "Psa."], 
  ["Proverbs", "Pr", "Pro", "Pro.", "Prov", "Prov."], 
  ["Ecclesiastes", "Ec", "Ecc", "Eccl", "Ecc.", "Eccl."], 
  ["Song of Solomon", "Song", "Song of Sol."], 
  ["Isaiah", "Is", "Isa", "Is.", "Isa."], 
  ["Jeremiah", "Jer", "Jer."], 
  ["Lamentations", "Lam", "La", "Lam."], 
  ["Ezekiel", "Ez", "Eze", "Ezek", "Ez.", "Ezek."], 
  ["Daniel", "Da", "Dan", "Dan."], 
  ["Hosea", "Ho", "Hos", "Hos."], 
  ["Joel", "Joe"], 
  ["Amos", "Am", "Amo"], 
  ["Obadiah", "Ob", "Obad", "Obad."], 
  ["Jonah", "Jon"], 
  ["Micah", "Mic", "Mic."], 
  ["Nahum", "Na", "Nah", "Nah."], 
  ["Habakkuk", "Hab", "Hab."], 
  ["Zephaniah", "Zep", "Zeph", "Zeph."], 
  ["Haggai", "Hag", "Hag."], 
  ["Zechariah", "Zec", "Zech", "Zech."], 
  ["Malachi", "Mal", "Mal."], 
  ["Matthew", "Mt", "Matt", "Matt."], 
  ["Mark", "Mr"], 
  ["Luke", "Lu"], 
  ["John", "Joh"], 
  ["Acts", "Ac", "Act"], 
  ["Romans", "Ro", "Rom", "Rom."], 
  ["1 Corinthians", "1Co", "1 Cor", "1 Cor."], 
  ["2 Corinthians", "2Co", "2 Cor", "2 Cor."], 
  ["Galatians", "Ga", "Gal", "Gal."], 
  ["Ephesians", "Eph", "Eph."], 
  ["Philippians", "Php", "Phil", "Phil."], 
  ["Colossians", "Col", "Col."], 
  ["1 Thessalonians", "1Th", "1 Thess", "1 Thess."], 
  ["2 Thessalonians", "2Th", "2 Thess", "2 Thess."], 
  ["1 Timothy", "1Ti", "1 Tim", "1 Tim."], 
  ["2 Timothy", "2Ti", "2 Tim", "2 Tim."], 
  ["Titus", "Tit", "Tit."], 
  ["Philemon", "Phm", "Philem", "Philem."], 
  ["Hebrews", "Heb", "Heb."], 
  ["James", "Ja", "Jas", "Jas."], 
  ["1 Peter", "1Pe", "1 Pet", "1 Pet."], 
  ["2 Peter", "2Pe", "2 Pet", "2 Pet."], 
  ["1 John", "1Jo"], 
  ["2 John", "2Jo"], 
  ["3 John", "3Jo"], 
  ["Jude"], 
  ["Revelation", "Re", "Rev", "Rev."]
];
const single_chapter_bible_nums = [31, 57, 63, 64, 65];
const blb_abbrev = [
  "gen", "exo", "lev", "num", "deu", "jos", "jdg", "rth", "1sa", "2sa",
  "1ki", "2ki", "1ch", "2ch", "ezr", "neh", "est", "job", "psa", "pro",
  "ecc", "sng", "isa", "jer", "lam", "eze", "dan", "hos", "joe", "amo",
  "oba", "jon", "mic", "nah", "hab", "zep", "hag", "zec", "mal", "mat", 
  "mar", "luk", "jhn", "act", "rom", "1co", "2co", "gal", "eph", "phl", 
  "col", "1th", "2th", "1ti", "2ti", "tit", "phm", "heb", "jas", "1pe", 
  "2pe", "1jo", "2jo", "3jo", "jde", "rev"
];


// ******************** Variables ********************

var current_book = "Genesis";
var current_book_num = 1;
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
  for (let i = 0; i < book_names.length; i++) {
    for (let j = 0; j < book_names[i].length; j++) {
      current_book = book_names[i][j];
      current_book_num = i+1;
      search();
    }
  }

  return true; 
}


function search() {
  search_string = '(?i) ' + current_book + '\.? ([0-9]+:?([0-9;:,-]?)+ ?)+';
  search_field = doc.getBody();
  search_result = search_field.findText(search_string);
  process();
}


function process() {
  while (search_result != null) {
    var search_result_start = search_result.getStartOffset();
    var search_result_end = search_result.getEndOffsetInclusive();
    reference_start_pos = search_result_start;

    search_result_element = search_result.getElement().asText(); // element is what the link attaches to
    var reference_string = search_result_element.getText().slice(search_result_start, search_result_end + 1);

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
  var references_list = reference_string.split(';');
  var references = [];
  let last_end_pos = -1;

  // split by comma
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

    // if there are still more push them as additional
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

  // take out the book name from the first reference
  let num_index = references[0].ref.search(/[0-9]/);
  references[0].ref = references[0].ref.slice(num_index);
  // take out :, -, and / that are at the end of any references
  for (let i = 0; i < references.length; i++) {
    if (references[i].ref.endsWith(":") || references[i].ref.endsWith("-") || references[i].ref.endsWith("/")) {
      references[i].ref = references[i].ref.slice(0,-1);
    }
  }

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
  } else if (single_chapter_bible_nums.includes(current_book_num)) {
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

  // insert link
  let url = getURL(chapter, verse_start, verse_end);
  let start_pos = reference_start_pos + reference.start_pos;
  let end_pos = reference_start_pos + reference.end_pos - 1;
  search_result_element.setLinkUrl(start_pos, end_pos, url);
}


function getURL(chapter, verse_start, verse_end) {
  let url_head = 'https://www.blueletterbible.org/';
  if (verse_end == verse_start) {
    return url_head + bible_version + '/' + blb_abbrev[current_book_num-1] + '/' + chapter + '/' + verse_start;
  } else {
    return url_head + bible_version + '/' + blb_abbrev[current_book_num-1] + '/' + chapter + '/' + verse_start + '-' + verse_end;
  }
}

