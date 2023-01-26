/* ***********************************************************************************
 * 
 *  Bible verse linker for Google Docs
 * 
 *  Inspiration taken from https://github.com/majal/bible-linker-google-docs
 *
 *********************************************************************************** */

/*
* @OnlyCurrentDoc
*/

function onInstall(e) {
  onOpen(e);
}


function onOpen(e) {

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
  var bible_version = 'kjv';

  /* ***********************************************************************************
   * 
   *  This is the link you want to change to make it work in different docs
   *
   *********************************************************************************** */
  var doc = DocumentApp.openByUrl('https://docs.google.com/document/d/1CZLs93W-U2ImrnDF__Nu-LNse_wxWnQHYnxIzD2v82c/edit');

  bible_linker(doc, bible_version);

}


function bible_linker(doc, bible_version) {

  // Set the latest used Bible version
  if (bible_version == undefined || bible_version == null) bible_version = 'kjv';

  // Get names of Bible books
  var book_names = consts('book_names');

  // Run parser for each Bible name/abbreviation
  for (let i=0; i < book_names.length; i++) {
      for (let j=0; j < book_names[i].length; j++) {
        bible_search(doc, bible_version, book_names[i][j], i+1);
      }
  }

}


function bible_search(doc, bible_version, bible_name, bible_num) {

  var single_chapters = consts('single_chapter_bible_nums');
  var search_field, search_result;
  var err_msg_title = 'Oops!';
  var err_msg = 'There was an error processing this verse:\n\n';

  // Search for Bible references
  var search_string = '(?i)' + bible_name + ' [0-9]+:[0-9,;:-]+';
  search_field = doc.getBody();
  search_result = search_field.findText(search_string);

  // Pass results to parser
  try {
    bible_parse(bible_version, bible_name, bible_num, search_result, search_field, search_string);
  } catch {
    let search_result_text_slice = search_result.getElement().asText().getText().slice(search_result.getStartOffset(), search_result.getEndOffsetInclusive() + 1);
    console.log('There was an error processing ' + search_result_text_slice);
  }

  // for single chapter books when only the verse is written and not the chapter
  if (single_chapters.includes(bible_num)) {
    search_string = '(?i)' + bible_name + ' [0-9,-]+';
    search_field = doc.getBody();
    search_result = search_field.findText(search_string);

    // Pass results to parser
    try {
      bible_parse(bible_version, bible_name, bible_num, search_result, search_field, search_string);
    } catch {
      let search_result_text_slice = search_result.getElement().asText().getText().slice(search_result.getStartOffset(), search_result.getEndOffsetInclusive() + 1);
      console.log('There was an error processing ' + search_result_text_slice);
    }
  }

}


function bible_parse(bible_version, bible_name, bible_num, search_result, search_field, search_string, search_field_start, search_field_end) {

  var single_chapters = consts('single_chapter_bible_nums');
  var extra_link_length = 0;

  // Cycle through each Bible reference found
  while (search_result != null) {

    // Set reference start and end
    var search_result_start = search_result.getStartOffset();
    var search_result_end = search_result.getEndOffsetInclusive();

    // Isolate reference only
    var search_result_astext = search_result.getElement().asText(); //halfway step is needed because link is set on this element, not its string version
    var search_result_text = search_result_astext.getText();
    var search_result_text_slice = search_result_text.slice(search_result_start, search_result_end + 1);

    // Split at semicolon (;)
    var bibleref_split = search_result_text_slice.split(';');
  
    // TODO: this might be the beginning of why it won't hyperlink things like Num. 13
    // Retain verses only, remove if it does not contain colon (:), exception on single chapter books
    for (let n=0; n < bibleref_split.length; n++) {
      if (!single_chapters.includes(bible_num) && !bibleref_split[n].includes(':')) {
        bibleref_split.splice(n, 1);
        n--;
      }
    }

    // TODO: what does it do with what's after the comma? seemingly nothing
    // Split by comma (,)
    for (let n=0; n < bibleref_split.length; n++) {
      if (bibleref_split[n].includes(',')) {
        bibleref_split[n] = bibleref_split[n].split(',');
        extra_link_length = bibleref_split[n][1].length + 1;

        // Rejoin if verses are consecutive
        if (Array.isArray(bibleref_split[n])) {
          for (let m=1; m < bibleref_split[n].length; m++) {
            if (parseInt(bibleref_split[n][m-1].match(/[0-9]+$/), 10) + 1 == parseInt(bibleref_split[n][m], 10)) {
              bibleref_split[n][m-1] += ',' + bibleref_split[n][m];
              bibleref_split[n].splice(m, 1);
              m--;
            }
          }

          // Convert array to string if consecutive verses
          if (bibleref_split[n].length == 1) {
            bibleref_split[n] = bibleref_split[n][0].toString();
          }
        }
      }
    }

    let select_start = 0;
    let select_end = 0;
    let url = '';
    let offset_reference = 0;

    // Parse and process
    for (let n=0; n < bibleref_split.length; n++) {

      let chapters = [], verse_start, verse_end;

      if (Array.isArray(bibleref_split[n])) { // I think this is only an array when there's a comma? see lines 161-165
        for (let m=0; m < bibleref_split[n].length; m++) {

          // Get chapter(s)
          if (single_chapters.includes(bible_num)) {
            chapters[0] = 1;
            chapters[1] = 1;
          } else {
            chapters = bibleref_split[n][0].match(/[0-9]+:/g);
            if (chapters.length == 1) {
              chapters[0] = chapters[0].replace(':', '');
              chapters[1] = chapters[0];
            } else {
              chapters[0] = chapters[0].replace(':', '');
              chapters[1] = chapters[1].replace(':', '');
            }
          }

          // Get verse(s)
          if (bibleref_split[n][m].includes(':')) {
            verse_start = bibleref_split[n][m].match(/:[0-9]+/).toString().replace(':', '');
            verse_end = bibleref_split[n][m].match(/[0-9]+\s*$/).toString().replace(':', '');
          } else {
            verse_start = bibleref_split[n][m].match(/\s[0-9]+/).toString();
            verse_end = bibleref_split[n][m].match(/[0-9]+\s*$/).toString();
          }

          // Get url link
          url = get_url(bible_version, bible_num, chapters[0], chapters[1], verse_start, verse_end);

          // Get url text ranges
          let url_text_len = bibleref_split[n][m].trim().length + extra_link_length;
          select_start = search_result_start + offset_reference;
          select_end = select_start + url_text_len - 1;
          
          // Set links if there is no selection or if selection exists and it is within the selection
          if ((!search_field_start && !search_field_end) || (search_field_start == -1 && search_field_end == -1) || (select_start >= search_field_start && select_end <= search_field_end)) {
            search_result_astext.setLinkUrl(select_start, select_end, url);
          }
          
          // Add to reference offset, plus two for comma/colon and space
          offset_reference += url_text_len + 2;
        }

      } else {

        // Get chapter(s)
        if (single_chapters.includes(bible_num)) {
          chapters[0] = 1;
          chapters[1] = 1;
        } else {
          chapters = bibleref_split[n].match(/[0-9]+:/g);
          if (chapters.length == 1) {
            chapters[0] = chapters[0].replace(':', '');
            chapters[1] = chapters[0];
          } else {
            chapters[0] = chapters[0].replace(':', '');
            chapters[1] = chapters[1].replace(':', '');
          }
        }

        // Get verse(s)
        if (bibleref_split[n].includes(':')) {
          verse_start = bibleref_split[n].match(/:[0-9]+/).toString().replace(':', '');
          verse_end = bibleref_split[n].match(/[0-9]+\s*$/).toString().replace(':', '');
        } else {
          verse_start = bibleref_split[n].match(/\s[0-9]+/).toString();
          verse_end = bibleref_split[n].match(/[0-9]+\s*$/).toString();
        }

        // Get url link
        url = get_url(bible_version, bible_num, chapters[0], chapters[1], verse_start, verse_end);

        // Get url text ranges
        let url_text_len = bibleref_split[n].trim().length + extra_link_length; 
        select_start = search_result_start + offset_reference;
        select_end = select_start + url_text_len - 1;
        
        // Set links if there is no selection or if selection exists and it is within the selection
        if ((!search_field_start && !search_field_end) || (search_field_start == -1 && search_field_end == -1) || (select_start >= search_field_start && select_end <= search_field_end)) { 
          search_result_astext.setLinkUrl(select_start, select_end, url);
        }

        // Add to reference offset, plus two for comma/colon and space
        offset_reference += url_text_len + 2
      }
    }

    // Find the next match
    search_result = search_field.findText(search_string, search_result);
  }

}


function get_url(bible_version, bible_name_num, chapter_start, chapter_end, verse_start, verse_end) {

  var url_head;
  var blb_abbrev = consts('blb_abbrev');

  chapter_start = parseInt(chapter_start, 10);
  chapter_end = parseInt(chapter_end, 10);
  verse_start = parseInt(verse_start, 10);
  verse_end = parseInt(verse_end, 10);

  url_head = 'https://www.blueletterbible.org/';

  if (chapter_start == chapter_end && verse_start == verse_end) { // one verse
    return url_head + bible_version + '/' + blb_abbrev[bible_name_num-1] + '/' + chapter_start + '/' + verse_start;
  } else if (chapter_start == chapter_end && verse_start != verse_end) { // range of verses in the same chapter
    return url_head + bible_version + '/' + blb_abbrev[bible_name_num-1] + '/' + chapter_start + '/' + verse_start + '-' + verse_end;
  } else { // range of verses over multiple chapters, only give the first verse
    return url_head + bible_version + '/' + blb_abbrev[bible_name_num-1] + '/' + chapter_start + '/' + verse_start;
  }

}


function consts(const_name) {
  switch (const_name) {

    case 'book_names':
      return [
        ["Genesis", "Ge", "Gen", "Gen."], 
        ["Exodus", "Ex", "Ex."], 
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
        ["Amos", "Am"], 
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
      break;

    case 'blb_abbrev':
      return ["gen", "exo", "lev", "num", "deu", "jos", "jdg", "rth", "1sa", "2sa", "1ki", "2ki", "1ch", "2ch", "ezr", "neh", "est", "job", "psa", "pro", "ecc", "sng", "isa", "jer", "lam", "eze", "dan", "hos", "joe", "amo", "oba", "jon", "mic", "nah", "hab", "zep", "hag", "zec", "mal", "mat", "mar", "luk", "jhn", "act", "rom", "1co", "2co", "gal", "eph", "phl", "col", "1th", "2th", "1ti", "2ti", "tit", "phm", "heb", "jas", "1pe", "2pe", "1jo", "2jo", "3jo", "jde", "rev"];
    break;

    case 'single_chapter_bible_nums':
      return [31, 57, 63, 64, 65];
      break;

    default:
      undefined;
  }

}