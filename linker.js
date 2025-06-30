// @OnlyCurrentDoc

// ******************** Startup functions ********************

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu().addItem('Start', 'showMenu').addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showMenu() {
  const ui = HtmlService.createHtmlOutputFromFile('menu').setTitle('Bible Verse Linker');
  DocumentApp.getUi().showSidebar(ui);
}

function getPreferences() {
  const userProperties = PropertiesService.getUserProperties();

  // check for empty properties and set defaults
  if (userProperties.getProperty('version') === null) {
    userProperties.setProperty('version', "");
  }
  if (userProperties.getProperty('overwrite_links') === null) {
    userProperties.setProperty('overwrite_links', 'false'); // Explicitly string for clarity
  }
  if (userProperties.getProperty('allow_link_formatting') === null) {
    userProperties.setProperty('allow_link_formatting', 'true');
  }
  if (userProperties.getProperty('save_prefs') === null) {
    userProperties.setProperty('save_prefs', 'false');
  }
  
  return userProperties.getProperties();
}

function savePreferences(prefs) {
  PropertiesService.getUserProperties()
    .setProperty('version', prefs.version)
    .setProperty('overwrite_links', prefs.overwrite_links)
    .setProperty('allow_link_formatting', prefs.allow_link_formatting)
    .setProperty('save_prefs', prefs.save_prefs);
}

var bible_version = "nkjv";
var overwrite_links = false;
var allow_link_formatting = true; // not implemented yet


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
  {num: 9, names: ["1 Samuel", "1st Samuel", "1 Sa", "1 Sam", "1st Sam"], blb: "1sa", len: 31}, 
  {num: 10, names: ["2 Samuel", "2nd Samuel", "2 Sa", "2 Sam", "2nd Sam"], blb: "2sa", len: 24}, 
  {num: 11, names: ["1 Kings", "1 Ki", "1st Kings", "1 King"], blb: "1ki", len: 22}, 
  {num: 12, names: ["2 Kings", "2 Ki", "2nd Kings", "2 King"], blb: "2ki", len: 25}, 
  {num: 13, names: ["1 Chronicles", "1st Chronicles", "1 Ch", "1 Chron", "1st Chron"], blb: "1ch", len: 29}, 
  {num: 14, names: ["2 Chronicles", "2nd Chronicles", "2 Ch", "2 Chron", "2nd Chron"], blb: "2ch", len: 36}, 
  {num: 15, names: ["Ezra", "Ezr", "Ez"], blb: "ezr", len: 10}, 
  {num: 16, names: ["Nehemiah", "Ne", "Neh"], blb: "neh", len: 13}, 
  {num: 17, names: ["Esther", "Es", "Est", "Esth"], blb: "est", len: 10}, 
  {num: 18, names: ["Job"], blb: "job", len: 42}, 
  {num: 19, names: ["Psalm", "Psalms", "Ps", "Psa"], blb: "psa", len: 150}, 
  {num: 20, names: ["Proverbs", "Pr", "Pro", "Prov"], blb: "pro", len: 31}, 
  {num: 21, names: ["Ecclesiastes", "Ec", "Ecc", "Eccl"], blb: "ecc", len: 12}, 
  {num: 22, names: ["Song Of Solomon", "Song", "Song Of Sol"], blb: "sng", len: 8},
  {num: 23, names: ["Isaiah", "Is\\.", "Isa"], blb: "isa", len: 66}, // period required for Is. because "is" is a common word
  {num: 24, names: ["Jeremiah", "Jer"], blb: "jer", len: 52}, 
  {num: 25, names: ["Lamentations", "Lam", "La"], blb: "lam", len: 5}, 
  {num: 26, names: ["Ezekiel", "Ez", "Eze", "Ezek"], blb: "eze", len: 48}, 
  {num: 27, names: ["Daniel", "Da", "Dan"], blb: "dan", len: 12}, 
  {num: 28, names: ["Hosea", "Ho", "Hos"], blb: "hos", len: 14}, 
  {num: 29, names: ["Joel", "Joe"], blb: "joe", len: 3}, 
  {num: 30, names: ["Amos", "Amo", "Am"], blb: "amo", len: 9}, 
  {num: 31, names: ["Obadiah", "Ob", "Obad"], blb: "oba", len: 1}, 
  {num: 32, names: ["Jonah", "Jon"], blb: "jon", len: 4}, 
  {num: 33, names: ["Micah", "Mic"], blb: "mic", len: 7}, 
  {num: 34, names: ["Nahum", "Na", "Nah"], blb: "nah", len: 3}, 
  {num: 35, names: ["Habakkuk", "Hab"], blb: "hab", len: 3}, 
  {num: 36, names: ["Zephaniah", "Zep", "Zeph"], blb: "zep", len: 3}, 
  {num: 37, names: ["Haggai", "Hag"], blb: "hag", len: 2}, 
  {num: 38, names: ["Zechariah", "Zec", "Zech"], blb: "zec", len: 14}, 
  {num: 39, names: ["Malachi", "Mal"], blb: "mal", len: 4}, 
  {num: 40, names: ["Matthew", "Mt", "Matt", "Mat"], blb: "mat", len: 28}, 
  {num: 41, names: ["Mark", "Mk", "Mar", "Mr"], blb: "mar", len: 16}, 
  {num: 42, names: ["Luke", "Lu", "Lk"], blb: "luk", len: 24}, 
  {num: 43, names: ["John", "Joh", "Jhn", "Jn"], blb: "jhn", len: 21}, 
  {num: 44, names: ["Acts", "Act", "Ac"], blb: "act", len: 28}, 
  {num: 45, names: ["Romans", "Ro", "Rom"], blb: "rom", len: 16}, 
  {num: 46, names: ["1 Corinthians", "1st Corinthians", "1 Co", "1 Cor", "1st Cor"], blb: "1co", len: 16}, 
  {num: 47, names: ["2 Corinthians", "2nd Corinthians", "2 Co", "2 Cor", "2nd Cor"], blb: "2co", len: 13}, 
  {num: 48, names: ["Galatians", "Ga", "Gal"], blb: "gal", len: 6}, 
  {num: 49, names: ["Ephesians", "Eph"], blb: "eph", len: 6},
  {num: 50, names: ["Philippians", "Php", "Phil"], blb: "phl", len: 4}, 
  {num: 51, names: ["Colossians", "Col"], blb: "col", len: 4}, 
  {num: 52, names: ["1 Thessalonians", "1st Thessalonians", "1 Th", "1 Thess", "1st Thess"], blb: "1th", len: 5}, 
  {num: 53, names: ["2 Thessalonians", "2nd Thessalonians", "2 Th", "2 Thess", "2nd Thess"], blb: "2th", len: 3}, 
  {num: 54, names: ["1 Timothy", "1st Timothy", "1 Ti", "1 Tim", "1st Tim"], blb: "1ti", len: 6},
  {num: 55, names: ["2 Timothy", "2nd Timothy", "2 Ti", "2 Tim", "2nd Tim"], blb: "2ti", len: 4},
  {num: 56, names: ["Titus", "Tit"], blb: "tit", len: 3}, 
  {num: 57, names: ["Philemon", "Phm", "Philem", "Phile"], blb: "phm", len: 1}, 
  {num: 58, names: ["Hebrews", "Heb"], blb: "heb", len: 13}, 
  {num: 59, names: ["James", "Ja", "Jam", "Jas"], blb: "jas", len: 5}, 
  {num: 60, names: ["1 Peter", "1st Peter", "1 Pe", "1 Pet", "1st Pet"], blb: "1pe", len: 5}, 
  {num: 61, names: ["2 Peter", "2nd Peter", "2 Pe", "2 Pet", "2nd Pet"], blb: "2pe", len: 3},
  {num: 62, names: ["1 John", "1st John", "1 Jo", "1 Jhn", "1st Jhn"], blb: "1jo", len: 5}, 
  {num: 63, names: ["2 John", "2nd John", "2 Jo", "2 Jhn", "2nd Jhn"], blb: "2jo", len: 1}, 
  {num: 64, names: ["3 John", "3rd John", "3 Jo", "3 Jhn", "3rd Jhn"], blb: "3jo", len: 1}, 
  {num: 65, names: ["Jude", "Jd"], blb: "jde", len: 1}, 
  {num: 66, names: ["Revelation", "Re", "Rev"], blb: "rev", len: 22}
];
const single_chapter_bible_nums = [31, 57, 63, 64, 65];
const numbered_book_names = {
  '1': [...books[8].names, ...books[10].names, ...books[12].names, ...books[45].names, ...books[51].names, ...books[53].names, ...books[59].names, ...books[61].names],
  '2': [...books[9].names, ...books[11].names, ...books[13].names, ...books[46].names, ...books[52].names, ...books[53].names, ...books[60].names, ...books[62].names],
  '3': [...books[63].names],
}


// ******************** Functions ********************

function link(bible_version_in, overwrite_links_in, allow_link_formatting_in=true) {
  bible_version = bible_version_in;
  overwrite_links = overwrite_links_in;
  allow_link_formatting = allow_link_formatting_in;

  let doc = DocumentApp.getActiveDocument();
  let body = doc.getActiveTab().asDocumentTab().getBody();
  let body_text = body.getText();

  let book_names = [];
  for (let i = 0; i < 66; i++) {
    for (let j = 0; j < books[i].names.length; j++) {
      book_names.push(books[i].names[j].replaceAll(" ", " *")); // replacement to match multiple spaces in case of typos
    }
  }

  try {
    search(body, body_text, book_names);
  } catch (error) {
    console.error("Something went wrong while searching for verses. \nError: " + error.message);
  }

  return {success: true};
}


function search(body, body_text, book_names) {
  let book_name_string = "";
  book_names.forEach((name) => {
    book_name_string += "\\b" + name + "\\b|";
  });
  book_name_string = book_name_string.substring(0, book_name_string.length - 1); // remove last |

  let search_string = "(" + book_name_string + ")\\.? *([0-9]+[:|v]?([0-9;:,-–—]?)+ ?)+";
  let regex = new RegExp(search_string, "gi");
  let matches = [];
  let match_arr;

  // search for references
  while ((match_arr = regex.exec(body_text)) !== null) {
    let matched_text = match_arr[0];
    matches.push({
      text: matched_text,
      global_start_offset: match_arr.index,
      global_end_offset: match_arr.index + matched_text.length - 1 // inclusive
    })
    regex.lastIndex = regex.lastIndex - 2;
    if (regex.lastIndex < 0) regex.lastIndex = 0;
  }

  matches.sort((a, b) => a.global_start_offset - b.global_start_offset);
  if (matches.length == 0) {
    console.log("No Bible verses found.");
    return;
  }

  // match those references to document elements and locations then handle them
  let global_offset_tracker = { value: 0 };
  let match_queue = matches.slice();
  for (let i = 0; i < body.getNumChildren(); i++) {
    if (match_queue.length == 0) break;
    process_doc_element(body.getChild(i), match_queue, global_offset_tracker);
  }
}


function handle_reference(element, element_text, reference_start, reference_end, reference_string) {
  const parse_reference = create_parser();
  let skip = false;

  if (!overwrite_links) {
    // check if the reference already has a link in which case it should be skipped not overwritten
    for (let i = reference_start; i <= reference_end; i++) {
      let url = element.getLinkUrl(i);
      if (url != null && !url.includes("blueletterbible.org/" + bible_version)) {
        // if it's a BLB link overwrite it (ex. John 1:3; 1 Peter 2:4 would link the 1 to John 1:1 and need to be overwritten)
        skip = true;
        break;
      }
    }
  }

  // if there's a letter before the book name it's most likely a false positive that should be skipped
  if (reference_start - 1 >= 0) {
    if (is_letter(element_text[reference_start - 1])) {
      skip = true;
    }
  }

  // if the last character in the reference string is the start of a numbered book name, it should not be linked here
  if (
    // first check if this could possibly be the start of another book name
    (reference_string.slice(-1) == '1' || reference_string.slice(-1) == '2' || reference_string.slice(-1) == '3')
    && (element_text.length > reference_end)
  ) {
    // search for book name match in subsequent text
    let remove_last_number = false;
    for (let i = 0; i < numbered_book_names[reference_string.slice(-1)].length; i++) {
      let book_name = numbered_book_names[reference_string.slice(-1)][i];
      if (element_text.substring(reference_end - 1, reference_end + book_name.length - 1) == book_name) {
        remove_last_number = true;
        break;
      }
    }
    if (remove_last_number) {
      reference_string = reference_string.slice(0, -1);
    }
  }

  if (!skip) {
    references = split_references(reference_string);
    references.forEach((ref) => {
      try {
        parse_reference(ref, element, reference_start);
      } catch (error) {
        console.error("Failed to parse reference: " + ref.ref + "\nError: " + error.message);
      }
    });
  }
}


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

  // take out empty references and punctuation at the end of any references
  for (let i = 0; i < references.length; i++) {
    if (references[i].ref == '') {
      references.splice(i, 1);
      i--;
      continue;
    }
    while (!is_number(references[i].ref.slice(-1))) {
      references[i].ref = references[i].ref.slice(0,-1);
      references[i].end_pos--;
    }
  }

  // determine the book name
  references[0].ref = references[0].ref.trim();
  let index = references[0].ref.length;
  // the following loop goes backward through the reference because if you go forward there's no way to know if a number is a chapter/verse or the start of one of the numbered books
  for (let i = references[0].ref.length - 1; i > 0; i--) {
    let c = references[0].ref[i];
    if (!((c >= '0' && c <= '9') || c == ' ' || c == ':' || c == 'v' || c == '-' || c == '–' || c == '—')) {
      index = i + 1;
      break;
    }
  }
  let book_name = references[0].ref.slice(0, index).trim().replace(/[ \.]+/g, '');
  let current_book;
  books.forEach((book) => {
    if (book.names.some(name => name.replace(/ +/g, '').localeCompare(book_name, undefined, { sensitivity: 'base' }) === 0)) {
      current_book = book;
    }
  });
  if (current_book === undefined) {
    console.error("Could not find book " + book_name)
  }
  references[0].ref = references[0].ref.slice(index).trim();
  references.forEach((reference) => {
    reference.book = current_book;
  });

  return references;
}


function create_parser() {
  let chapter = 1;
  return function(reference, search_result_element, search_result_start) {
    let ref = reference.ref;

    if (ref == '') {
      return;
    }

    // console.log(reference);

    // set chapter
    if (reference.after_comma == true && !(ref.includes(':') || ref.includes('v'))) {
      // chapter is already set from last reference, don't need to do anything
    } else if (single_chapter_bible_nums.includes(reference.book.num)) {
      chapter = 1;
      if (ref.includes(':')) {
        ref = ref.slice(ref.indexOf(':') + 1);
      } else if (ref.includes('v')) {
        ref = ref.slice(ref.indexOf('v') + 1);
      }
    } else {
      for (let i = 0; i < ref.length + 1; i++) {
        if (i == ref.length || ref[i] == ':' || ref[i] == 'v' || ref[i] == '-' || ref[i] == '–' || ref[i] == '—' || ref[i] == ';') {
          chapter = ref.slice(0,i);
          if (i < ref.length && (ref[i] == ':' || ref[i] == 'v')) {
            ref = ref.slice(i + 1); // take out the chapter so it's easier to find verses
          } else {
            ref = "";
          }
          break;
        }
      }
    }

    let verse_start = 1;
    let verse_end = 1;

    // set verses
    if (ref.length > 0) {
      if (ref.includes(':')) {
        ref = ref.slice(ref.indexOf(':') + 1);
      } else if (ref.includes('v')) {
        ref = ref.slice(ref.indexOf('v') + 1);
      }
      if (ref.includes('-')) {
        verse_start = ref.slice(0, ref.indexOf('-'));
        verse_end = ref.slice(ref.indexOf('-') + 1);
      } else if (ref.includes('–')) { // en dash
        verse_start = ref.slice(0, ref.indexOf('–'));
        verse_end = ref.slice(ref.indexOf('–') + 1);
      } else if (ref.includes('—')) { // em dash
        verse_start = ref.slice(0, ref.indexOf('—'));
        verse_end = ref.slice(ref.indexOf('—') + 1);
      } else {
        verse_start = ref;
        verse_end = verse_start;
      }
    }

    if (chapter > reference.book.len) {
      // probably a user typo or regex finding that's not actually a book and chapter
      return; 
    }

    // insert link
    let url = "https://www.blueletterbible.org/";
    if (verse_end == verse_start) {
      url = url + bible_version + '/' + reference.book.blb + '/' + chapter + '/' + verse_start;
    } else {
      url = url + bible_version + '/' + reference.book.blb + '/' + chapter + '/' + verse_start + '-' + verse_end;
    }
    let start_pos = search_result_start + reference.start_pos;
    let end_pos = search_result_start + reference.end_pos - 1;
    search_result_element.setLinkUrl(start_pos, end_pos, url);
  };
}


function process_doc_element(element, match_queue, global_offset_tracker) {
  if (match_queue.length == 0) return;

  let elt_type = element.getType();
  let text_elt = null;
  let text = "";

  switch (elt_type) {
    case DocumentApp.ElementType.PARAGRAPH:
      text_elt = element.asParagraph().editAsText();
      text = text_elt.getText();
      process_text(text_elt, text, elt_type.toString(), match_queue, global_offset_tracker);

      global_offset_tracker.value += text.length;
      global_offset_tracker.value += 1; // newline
      break;

    case DocumentApp.ElementType.LIST_ITEM:
      text_elt = element.asListItem().editAsText();
      text = text_elt.getText();
      process_text(text_elt, text, elt_type.toString(), match_queue, global_offset_tracker);

      global_offset_tracker.value += text.length;
      global_offset_tracker.value += 1; // newline
      break;

    case DocumentApp.ElementType.TABLE:
      let table = element.asTable();
      for (let r = 0; r < table.getNumRows(); r++) {
        let row = table.getRow(r);
        for (let c = 0; c < row.getNumCells(); c++) {
          let cell = row.getCell(c);
          for (let k = 0; k < cell.getNumChildren(); k++) {
            if (match_queue.length == 0) break;
            process_doc_element(cell.getChild(k), match_queue, global_offset_tracker);
          }
          if (c < row.getNumCells() - 1) {
            global_offset_tracker.value += 1; // inter-cell separator
          }
        }
      }
      break;

    case DocumentApp.ElementType.INLINE_IMAGE:
      global_offset_tracker.value += 1;
      break;

    default: 
      if (typeof element.getNumChildren === 'function') {
        for (let i = 0; i < element.getNumChildren(); i++) {
          if (match_queue.length == 0) break;
          process_doc_element(element.getChild(i), match_queue, global_offset_tracker);
        }
      }
      break;
  }
}


function process_text(text_elt, text, elt_type, match_queue, global_offset_tracker) {
  let text_length = text.length;
  if (text_length === 0) {
    return;
  }

  let relevant_to_elt = true;
  while (relevant_to_elt && match_queue.length > 0) {
    let current_match = match_queue[0];

    // check if the current match could start in this element
    if (current_match.global_start_offset < global_offset_tracker.value + text_length) {
      // check if it actually overlaps
      if (current_match.global_end_offset >= global_offset_tracker.value) {
        let local_start_offset = current_match.global_start_offset - global_offset_tracker.value;
        let local_end_offset = current_match.global_end_offset - global_offset_tracker.value;

        local_start_offset = Math.max(0, local_start_offset);
        local_end_offset = Math.min(text_length - 1, local_end_offset); // inclusive

        if (local_start_offset <= local_end_offset) {
          handle_reference(text_elt, text, local_start_offset, local_end_offset, text.substring(local_start_offset, local_end_offset + 1).trim());
        }

        if (current_match.global_end_offset < global_offset_tracker.value + text_length) {
          // done
          match_queue.shift(); 
        } else {
          // match is partly in next element
          relevant_to_elt = false; 
        }
      } else {
        // match ends before this element
        relevant_to_elt = false; 
      }
    } else {
      // match starts after this element
      relevant_to_elt = false; 
    }
  }
}


function is_letter(char) {
  return char.toLowerCase() != char.toUpperCase();
}


function is_number(char) {
  return char >= '0' && char <= '9';
}
