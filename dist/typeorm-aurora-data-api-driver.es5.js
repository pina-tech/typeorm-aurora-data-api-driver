import awsSdk from 'aws-sdk';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var SqlString_1 = createCommonjsModule(function (module, exports) {
var SqlString  = exports;

var ID_GLOBAL_REGEXP    = /`/g;
var QUAL_GLOBAL_REGEXP  = /\./g;
var CHARS_GLOBAL_REGEXP = /[\0\b\t\n\r\x1a\"\'\\]/g; // eslint-disable-line no-control-regex
var CHARS_ESCAPE_MAP    = {
  '\0'   : '\\0',
  '\b'   : '\\b',
  '\t'   : '\\t',
  '\n'   : '\\n',
  '\r'   : '\\r',
  '\x1a' : '\\Z',
  '"'    : '\\"',
  '\''   : '\\\'',
  '\\'   : '\\\\'
};

SqlString.escapeId = function escapeId(val, forbidQualified) {
  if (Array.isArray(val)) {
    var sql = '';

    for (var i = 0; i < val.length; i++) {
      sql += (i === 0 ? '' : ', ') + SqlString.escapeId(val[i], forbidQualified);
    }

    return sql;
  } else if (forbidQualified) {
    return '`' + String(val).replace(ID_GLOBAL_REGEXP, '``') + '`';
  } else {
    return '`' + String(val).replace(ID_GLOBAL_REGEXP, '``').replace(QUAL_GLOBAL_REGEXP, '`.`') + '`';
  }
};

SqlString.escape = function escape(val, stringifyObjects, timeZone) {
  if (val === undefined || val === null) {
    return 'NULL';
  }

  switch (typeof val) {
    case 'boolean': return (val) ? 'true' : 'false';
    case 'number': return val + '';
    case 'object':
      if (val instanceof Date) {
        return SqlString.dateToString(val, timeZone || 'local');
      } else if (Array.isArray(val)) {
        return SqlString.arrayToList(val, timeZone);
      } else if (Buffer.isBuffer(val)) {
        return SqlString.bufferToString(val);
      } else if (typeof val.toSqlString === 'function') {
        return String(val.toSqlString());
      } else if (stringifyObjects) {
        return escapeString(val.toString());
      } else {
        return SqlString.objectToValues(val, timeZone);
      }
    default: return escapeString(val);
  }
};

SqlString.arrayToList = function arrayToList(array, timeZone) {
  var sql = '';

  for (var i = 0; i < array.length; i++) {
    var val = array[i];

    if (Array.isArray(val)) {
      sql += (i === 0 ? '' : ', ') + '(' + SqlString.arrayToList(val, timeZone) + ')';
    } else {
      sql += (i === 0 ? '' : ', ') + SqlString.escape(val, true, timeZone);
    }
  }

  return sql;
};

SqlString.format = function format(sql, values, stringifyObjects, timeZone) {
  if (values == null) {
    return sql;
  }

  if (!Array.isArray(values)) {
    values = [values];
  }

  var chunkIndex        = 0;
  var placeholdersRegex = /\?+/g;
  var result            = '';
  var valuesIndex       = 0;
  var match;

  while (valuesIndex < values.length && (match = placeholdersRegex.exec(sql))) {
    var len = match[0].length;

    if (len > 2) {
      continue;
    }

    var value = len === 2
      ? SqlString.escapeId(values[valuesIndex])
      : SqlString.escape(values[valuesIndex], stringifyObjects, timeZone);

    result += sql.slice(chunkIndex, match.index) + value;
    chunkIndex = placeholdersRegex.lastIndex;
    valuesIndex++;
  }

  if (chunkIndex === 0) {
    // Nothing was replaced
    return sql;
  }

  if (chunkIndex < sql.length) {
    return result + sql.slice(chunkIndex);
  }

  return result;
};

SqlString.dateToString = function dateToString(date, timeZone) {
  var dt = new Date(date);

  if (isNaN(dt.getTime())) {
    return 'NULL';
  }

  var year;
  var month;
  var day;
  var hour;
  var minute;
  var second;
  var millisecond;

  if (timeZone === 'local') {
    year        = dt.getFullYear();
    month       = dt.getMonth() + 1;
    day         = dt.getDate();
    hour        = dt.getHours();
    minute      = dt.getMinutes();
    second      = dt.getSeconds();
    millisecond = dt.getMilliseconds();
  } else {
    var tz = convertTimezone(timeZone);

    if (tz !== false && tz !== 0) {
      dt.setTime(dt.getTime() + (tz * 60000));
    }

    year       = dt.getUTCFullYear();
    month       = dt.getUTCMonth() + 1;
    day         = dt.getUTCDate();
    hour        = dt.getUTCHours();
    minute      = dt.getUTCMinutes();
    second      = dt.getUTCSeconds();
    millisecond = dt.getUTCMilliseconds();
  }

  // YYYY-MM-DD HH:mm:ss.mmm
  var str = zeroPad(year, 4) + '-' + zeroPad(month, 2) + '-' + zeroPad(day, 2) + ' ' +
    zeroPad(hour, 2) + ':' + zeroPad(minute, 2) + ':' + zeroPad(second, 2) + '.' +
    zeroPad(millisecond, 3);

  return escapeString(str);
};

SqlString.bufferToString = function bufferToString(buffer) {
  return 'X' + escapeString(buffer.toString('hex'));
};

SqlString.objectToValues = function objectToValues(object, timeZone) {
  var sql = '';

  for (var key in object) {
    var val = object[key];

    if (typeof val === 'function') {
      continue;
    }

    sql += (sql.length === 0 ? '' : ', ') + SqlString.escapeId(key) + ' = ' + SqlString.escape(val, true, timeZone);
  }

  return sql;
};

SqlString.raw = function raw(sql) {
  if (typeof sql !== 'string') {
    throw new TypeError('argument sql must be a string');
  }

  return {
    toSqlString: function toSqlString() { return sql; }
  };
};

function escapeString(val) {
  var chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex = 0;
  var escapedVal = '';
  var match;

  while ((match = CHARS_GLOBAL_REGEXP.exec(val))) {
    escapedVal += val.slice(chunkIndex, match.index) + CHARS_ESCAPE_MAP[match[0]];
    chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex;
  }

  if (chunkIndex === 0) {
    // Nothing was escaped
    return "'" + val + "'";
  }

  if (chunkIndex < val.length) {
    return "'" + escapedVal + val.slice(chunkIndex) + "'";
  }

  return "'" + escapedVal + "'";
}

function zeroPad(number, length) {
  number = number.toString();
  while (number.length < length) {
    number = '0' + number;
  }

  return number;
}

function convertTimezone(tz) {
  if (tz === 'Z') {
    return 0;
  }

  var m = tz.match(/([\+\-\s])(\d\d):?(\d\d)?/);
  if (m) {
    return (m[1] === '-' ? -1 : 1) * (parseInt(m[2], 10) + ((m[3] ? parseInt(m[3], 10) : 0) / 60)) * 60;
  }
  return false;
}
});

var sqlstring = SqlString_1;

/*
 * This module provides a simplified interface into the Aurora Serverless
 * Data API by abstracting away the notion of field values.
 *
 * More detail regarding the Aurora Serverless Data APIcan be found here:
 * https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/data-api.html
 *
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @version 1.2.0
 * @license MIT
 */

// Require the aws-sdk. This is a dev dependency, so if being used
// outside of a Lambda execution environment, it must be manually installed.


// Require sqlstring to add additional escaping capabilities


// Supported value types in the Data API
const supportedTypes = [
  'arrayValue',
  'blobValue',
  'booleanValue',
  'doubleValue',
  'isNull',
  'longValue',
  'stringValue',
  'structValue'
];

/********************************************************************/
/**  PRIVATE METHODS                                               **/
/********************************************************************/

// Simple error function
const error = (...err) => {
  throw Error(...err)
};

// Parse SQL statement from provided arguments
const parseSQL = (args) =>
  typeof args[0] === 'string'
    ? args[0]
    : typeof args[0] === 'object' && typeof args[0].sql === 'string'
    ? args[0].sql
    : error(`No 'sql' statement provided.`);

// Parse the parameters from provided arguments
const parseParams = (args) =>
  Array.isArray(args[0].parameters)
    ? args[0].parameters
    : typeof args[0].parameters === 'object'
    ? [args[0].parameters]
    : Array.isArray(args[1])
    ? args[1]
    : typeof args[1] === 'object'
    ? [args[1]]
    : args[0].parameters
    ? error(`'parameters' must be an object or array`)
    : args[1]
    ? error('Parameters must be an object or array')
    : [];

// Parse the supplied database, or default to config
const parseDatabase = (config, args) =>
  config.transactionId
    ? config.database
    : typeof args[0].database === 'string'
    ? args[0].database
    : args[0].database
    ? error(`'database' must be a string.`)
    : config.database
    ? config.database
    : undefined; // removed for #47 - error('No \'database\' provided.')

// Parse the supplied hydrateColumnNames command, or default to config
const parseHydrate = (config, args) =>
  typeof args[0].hydrateColumnNames === 'boolean'
    ? args[0].hydrateColumnNames
    : args[0].hydrateColumnNames
    ? error(`'hydrateColumnNames' must be a boolean.`)
    : config.hydrateColumnNames;

// Parse the supplied format options, or default to config
const parseFormatOptions = (config, args) =>
  typeof args[0].formatOptions === 'object'
    ? {
        deserializeDate:
          typeof args[0].formatOptions.deserializeDate === 'boolean'
            ? args[0].formatOptions.deserializeDate
            : args[0].formatOptions.deserializeDate
            ? error(`'formatOptions.deserializeDate' must be a boolean.`)
            : config.formatOptions.deserializeDate,
        treatAsLocalDate:
          typeof args[0].formatOptions.treatAsLocalDate == 'boolean'
            ? args[0].formatOptions.treatAsLocalDate
            : args[0].formatOptions.treatAsLocalDate
            ? error(`'formatOptions.treatAsLocalDate' must be a boolean.`)
            : config.formatOptions.treatAsLocalDate
      }
    : args[0].formatOptions
    ? error(`'formatOptions' must be an object.`)
    : config.formatOptions;

// Prepare method params w/ supplied inputs if an object is passed
const prepareParams = ({ secretArn, resourceArn }, args) => {
  return Object.assign(
    { secretArn, resourceArn }, // return Arns
    typeof args[0] === 'object' ? omit(args[0], ['hydrateColumnNames', 'parameters']) : {} // merge any inputs
  )
};

// Utility function for removing certain keys from an object
const omit = (obj, values) =>
  Object.keys(obj).reduce((acc, x) => (values.includes(x) ? acc : Object.assign(acc, { [x]: obj[x] })), {});

// Utility function for picking certain keys from an object
const pick = (obj, values) =>
  Object.keys(obj).reduce((acc, x) => (values.includes(x) ? Object.assign(acc, { [x]: obj[x] }) : acc), {});

// Utility function for flattening arrays
const flatten = (arr) => arr.reduce((acc, x) => acc.concat(x), []);

// Normize parameters so that they are all in standard format
const normalizeParams = (params) =>
  params.reduce(
    (acc, p) =>
      Array.isArray(p)
        ? acc.concat([normalizeParams(p)])
        : (Object.keys(p).length === 2 && p.name && typeof p.value !== 'undefined') ||
          (Object.keys(p).length === 3 && p.name && typeof p.value !== 'undefined' && p.cast)
        ? acc.concat(p)
        : acc.concat(splitParams(p)),
    []
  ); // end reduce

// Prepare parameters
const processParams = (engine, sql, sqlParams, params, formatOptions, row = 0) => {
  return {
    processedParams: params.reduce((acc, p) => {
      if (Array.isArray(p)) {
        const result = processParams(engine, sql, sqlParams, p, formatOptions, row);
        if (row === 0) {
          sql = result.escapedSql;
          row++;
        }
        return acc.concat([result.processedParams])
      } else if (sqlParams[p.name]) {
        if (sqlParams[p.name].type === 'n_ph') {
          if (p.cast) {
            const regex = new RegExp(':' + p.name + '\\b', 'g');
            sql = sql.replace(regex, engine === 'pg' ? `:${p.name}::${p.cast}` : `CAST(:${p.name} AS ${p.cast})`);
          }
          acc.push(formatParam(p.name, p.value, formatOptions));
        } else if (row === 0) {
          const regex = new RegExp('::' + p.name + '\\b', 'g');
          sql = sql.replace(regex, sqlstring.escapeId(p.value));
        }
        return acc
      } else {
        return acc
      }
    }, []),
    escapedSql: sql
  }
};

// Converts parameter to the name/value format
const formatParam = (n, v, formatOptions) => formatType(n, v, getType(v), getTypeHint(v), formatOptions);

// Converts object params into name/value format
const splitParams = (p) => Object.keys(p).reduce((arr, x) => arr.concat({ name: x, value: p[x] }), []);

// Get all the sql parameters and assign them types
const getSqlParams = (sql) => {
  // TODO: probably need to remove comments from the sql
  // TODO: placeholders?
  // sql.match(/\:{1,2}\w+|\?+/g).map((p,i) => {
  return (sql.match(/:{1,2}\w+/g) || [])
    .map((p) => {
      // TODO: future support for placeholder parsing?
      // return p === '??' ? { type: 'id' } // identifier
      //   : p === '?' ? { type: 'ph', label: '__d'+i  } // placeholder
      return p.startsWith('::')
        ? { type: 'n_id', label: p.substr(2) } // named id
        : { type: 'n_ph', label: p.substr(1) } // named placeholder
    })
    .reduce((acc, x) => {
      return Object.assign(acc, {
        [x.label]: {
          type: x.type
        }
      })
    }, {}) // end reduce
};

// Gets the value type and returns the correct value field name
// TODO: Support more types as the are released
const getType = (val) =>
  typeof val === 'string'
    ? 'stringValue'
    : typeof val === 'boolean'
    ? 'booleanValue'
    : typeof val === 'number' && parseInt(val) === val
    ? 'longValue'
    : typeof val === 'number' && parseFloat(val) === val
    ? 'doubleValue'
    : val === null
    ? 'isNull'
    : isDate(val)
    ? 'stringValue'
    : Buffer.isBuffer(val)
    ? 'blobValue'
    : // : Array.isArray(val) ? 'arrayValue' This doesn't work yet
    // TODO: there is a 'structValue' now for postgres
    typeof val === 'object' && Object.keys(val).length === 1 && supportedTypes.includes(Object.keys(val)[0])
    ? null
    : undefined;

// Hint to specify the underlying object type for data type mapping
const getTypeHint = (val) => (isDate(val) ? 'TIMESTAMP' : undefined);

const isDate = (val) => val instanceof Date;

// Creates a standard Data API parameter using the supplied inputs
const formatType = (name, value, type, typeHint, formatOptions) => {
  return Object.assign(
    typeHint != null ? { name, typeHint } : { name },
    type === null
      ? { value }
      : {
          value: {
            [type ? type : error(`'${name}' is an invalid type`)]:
              type === 'isNull'
                ? true
                : isDate(value)
                ? formatToTimeStamp(value, formatOptions && formatOptions.treatAsLocalDate)
                : value
          }
        }
  )
}; // end formatType

// Formats the (UTC) date to the AWS accepted YYYY-MM-DD HH:MM:SS[.FFF] format
// See https://docs.aws.amazon.com/rdsdataservice/latest/APIReference/API_SqlParameter.html
const formatToTimeStamp = (date, treatAsLocalDate) => {
  const pad = (val, num = 2) => '0'.repeat(num - (val + '').length) + val;

  const year = treatAsLocalDate ? date.getFullYear() : date.getUTCFullYear();
  const month = (treatAsLocalDate ? date.getMonth() : date.getUTCMonth()) + 1; // Convert to human month
  const day = treatAsLocalDate ? date.getDate() : date.getUTCDate();

  const hours = treatAsLocalDate ? date.getHours() : date.getUTCHours();
  const minutes = treatAsLocalDate ? date.getMinutes() : date.getUTCMinutes();
  const seconds = treatAsLocalDate ? date.getSeconds() : date.getUTCSeconds();
  const ms = treatAsLocalDate ? date.getMilliseconds() : date.getUTCMilliseconds();

  const fraction = ms <= 0 ? '' : `.${pad(ms, 3)}`;

  return `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}${fraction}`
};

// Converts the string value to a Date object.
// If standard TIMESTAMP format (YYYY-MM-DD[ HH:MM:SS[.FFF]]) without TZ + treatAsLocalDate=false then assume UTC Date
// In all other cases convert value to datetime as-is (also values with TZ info)
const formatFromTimeStamp = (value, treatAsLocalDate) =>
  !treatAsLocalDate && /^\d{4}-\d{2}-\d{2}(\s\d{2}:\d{2}:\d{2}(\.\d+)?)?$/.test(value)
    ? new Date(value + 'Z')
    : new Date(value);

// Formats the results of a query response
const formatResults = (
  {
    // destructure results
    columnMetadata, // ONLY when hydrate or includeResultMetadata is true
    numberOfRecordsUpdated, // ONLY for executeStatement method
    records, // ONLY for executeStatement method
    generatedFields, // ONLY for INSERTS
    updateResults // ONLY on batchExecuteStatement
  },
  hydrate,
  includeMeta,
  formatOptions
) =>
  Object.assign(
    includeMeta ? { columnMetadata } : {},
    numberOfRecordsUpdated !== undefined && !records ? { numberOfRecordsUpdated } : {},
    records
      ? {
          records: formatRecords(records, columnMetadata, hydrate, formatOptions)
        }
      : {},
    updateResults ? { updateResults: formatUpdateResults(updateResults) } : {},
    generatedFields && generatedFields.length > 0 ? { insertId: generatedFields[0].longValue } : {}
  );

// Processes records and either extracts Typed Values into an array, or
// object with named column labels
const formatRecords = (recs, columns, hydrate, formatOptions) => {
  // Create map for efficient value parsing
  let fmap =
    recs && recs[0]
      ? recs[0].map((x, i) => {
          return Object.assign({}, columns ? { label: columns[i].label, typeName: columns[i].typeName } : {}) // add column label and typeName
        })
      : {};

  // Map over all the records (rows)
  return recs
    ? recs.map((rec) => {
        // Reduce each field in the record (row)
        return rec.reduce(
          (acc, field, i) => {
            // If the field is null, always return null
            if (field.isNull === true) {
              return hydrate // object if hydrate, else array
                ? Object.assign(acc, { [fmap[i].label]: null })
                : acc.concat(null)

              // If the field is mapped, return the mapped field
            } else if (fmap[i] && fmap[i].field) {
              const value = formatRecordValue(field[fmap[i].field], fmap[i].typeName, formatOptions);
              return hydrate // object if hydrate, else array
                ? Object.assign(acc, { [fmap[i].label]: value })
                : acc.concat(value)

              // Else discover the field type
            } else {
              // Look for non-null fields
              Object.keys(field).map((type) => {
                if (type !== 'isNull' && field[type] !== null) {
                  fmap[i]['field'] = type;
                }
              });

              // Return the mapped field (this should NEVER be null)
              const value = formatRecordValue(field[fmap[i].field], fmap[i].typeName, formatOptions);
              return hydrate // object if hydrate, else array
                ? Object.assign(acc, { [fmap[i].label]: value })
                : acc.concat(value)
            }
          },
          hydrate ? {} : []
        ) // init object if hydrate, else init array
      })
    : [] // empty record set returns an array
}; // end formatRecords

// Format record value based on its value, the database column's typeName and the formatting options
const formatRecordValue = (value, typeName, formatOptions) => {
  if (
    formatOptions &&
    formatOptions.deserializeDate &&
    ['DATE', 'DATETIME', 'TIMESTAMP', 'TIMESTAMPTZ', 'TIMESTAMP WITH TIME ZONE'].includes(typeName.toUpperCase())
  ) {
    return formatFromTimeStamp(
      value,
      (formatOptions && formatOptions.treatAsLocalDate) || typeName === 'TIMESTAMP WITH TIME ZONE'
    )
  } else if (typeName === 'JSON') {
    return JSON.parse(value)
  } else {
    return value
  }
};

// Format updateResults and extract insertIds
const formatUpdateResults = (res) =>
  res.map((x) => {
    return x.generatedFields && x.generatedFields.length > 0 ? { insertId: x.generatedFields[0].longValue } : {}
  });

// Merge configuration data with supplied arguments
const mergeConfig = (initialConfig, args) => Object.assign(initialConfig, args);

/********************************************************************/
/**  QUERY MANAGEMENT                                              **/
/********************************************************************/

// Query function (use standard form for `this` context)
const query = async function (config, ..._args) {
  // Flatten array if nested arrays (fixes #30)
  const args = Array.isArray(_args[0]) ? flatten(_args) : _args;

  // Parse and process sql
  const sql = parseSQL(args);
  const sqlParams = getSqlParams(sql);

  // Parse hydration setting
  const hydrateColumnNames = parseHydrate(config, args);

  // Parse data format settings
  const formatOptions = parseFormatOptions(config, args);

  // Parse and normalize parameters
  const parameters = normalizeParams(parseParams(args));

  // Process parameters and escape necessary SQL
  const { processedParams, escapedSql } = processParams(config.engine, sql, sqlParams, parameters, formatOptions);

  // Determine if this is a batch request
  const isBatch = processedParams.length > 0 && Array.isArray(processedParams[0]);

  // Create/format the parameters
  const params = Object.assign(
    prepareParams(config, args),
    {
      database: parseDatabase(config, args), // add database
      sql: escapedSql // add escaped sql statement
    },
    // Only include parameters if they exist
    processedParams.length > 0
      ? // Batch statements require parameterSets instead of parameters
        { [isBatch ? 'parameterSets' : 'parameters']: processedParams }
      : {},
    // Force meta data if set and not a batch
    hydrateColumnNames && !isBatch ? { includeResultMetadata: true } : {},
    // If a transactionId is passed, overwrite any manual input
    config.transactionId ? { transactionId: config.transactionId } : {}
  ); // end params

  try {
    // attempt to run the query

    // Capture the result for debugging
    let result = await (isBatch
      ? config.RDS.batchExecuteStatement(params).promise()
      : config.RDS.executeStatement(params).promise());

    // Format and return the results
    return formatResults(result, hydrateColumnNames, args[0].includeResultMetadata === true, formatOptions)
  } catch (e) {
    if (this && this.rollback) {
      let rollback = await config.RDS.rollbackTransaction(
        pick(params, ['resourceArn', 'secretArn', 'transactionId'])
      ).promise();

      this.rollback(e, rollback);
    }
    // Throw the error
    throw e
  }
}; // end query

/********************************************************************/
/**  TRANSACTION MANAGEMENT                                        **/
/********************************************************************/

// Init a transaction object and return methods
const transaction = (config, _args) => {
  let args = typeof _args === 'object' ? [_args] : [{}];
  let queries = []; // keep track of queries
  let rollback = () => {}; // default rollback event

  const txConfig = Object.assign(prepareParams(config, args), {
    database: parseDatabase(config, args), // add database
    hydrateColumnNames: parseHydrate(config, args), // add hydrate
    formatOptions: parseFormatOptions(config, args), // add formatOptions
    RDS: config.RDS // reference the RDSDataService instance
  });

  return {
    query: function (...args) {
      if (typeof args[0] === 'function') {
        queries.push(args[0]);
      } else {
        queries.push(() => [...args]);
      }
      return this
    },
    rollback: function (fn) {
      if (typeof fn === 'function') {
        rollback = fn;
      }
      return this
    },
    commit: async function () {
      return await commit(txConfig, queries, rollback)
    }
  }
};

// Commit transaction by running queries
const commit = async (config, queries, rollback) => {
  let results = []; // keep track of results

  // Start a transaction
  const { transactionId } = await config.RDS.beginTransaction(
    pick(config, ['resourceArn', 'secretArn', 'database'])
  ).promise();

  // Add transactionId to the config
  let txConfig = Object.assign(config, { transactionId });

  // Loop through queries
  for (let i = 0; i < queries.length; i++) {
    // Execute the queries, pass the rollback as context
    let result = await query.apply({ rollback }, [config, queries[i](results[results.length - 1], results)]);
    // Add the result to the main results accumulator
    results.push(result);
  }

  // Commit our transaction
  const { transactionStatus } = await txConfig.RDS.commitTransaction(
    pick(config, ['resourceArn', 'secretArn', 'transactionId'])
  ).promise();

  // Add the transaction status to the results
  results.push({ transactionStatus });

  // Return the results
  return results
};

/********************************************************************/
/**  INSTANTIATION                                                 **/
/********************************************************************/

// Export main function
/**
 * Create a Data API client instance
 * @param {object} params
 * @param {'mysql'|'pg'} [params.engine=mysql] The type of database (MySQL or Postgres)
 * @param {string} params.resourceArn The ARN of your Aurora Serverless Cluster
 * @param {string} params.secretArn The ARN of the secret associated with your
 *   database credentials
 * @param {string} [params.database] The name of the database
 * @param {boolean} [params.hydrateColumnNames=true] Return objects with column
 *   names as keys
 * @param {object} [params.options={}] Configuration object passed directly
 *   into RDSDataService
 * @param {object} [params.formatOptions] Date-related formatting options
 * @param {boolean} [params.formatOptions.deserializeDate=false]
 * @param {boolean} [params.formatOptions.treatAsLocalDate=false]
 * @param {boolean} [params.keepAlive] DEPRECATED
 * @param {boolean} [params.sslEnabled=true] DEPRECATED
 * @param {string} [params.region] DEPRECATED
 *
 */
const init = (params) => {
  // Set the options for the RDSDataService
  const options =
    typeof params.options === 'object'
      ? params.options
      : params.options !== undefined
      ? error(`'options' must be an object`)
      : {};

  // Update the AWS http agent with the region
  if (typeof params.region === 'string') {
    options.region = params.region;
  }

  // Disable ssl if wanted for local development
  if (params.sslEnabled === false) {
    options.sslEnabled = false;
  }

  // Set the configuration for this instance
  const config = {
    // Require engine
    engine: typeof params.engine === 'string' ? params.engine : 'mysql',

    // Require secretArn
    secretArn: typeof params.secretArn === 'string' ? params.secretArn : error(`'secretArn' string value required`),

    // Require resourceArn
    resourceArn:
      typeof params.resourceArn === 'string' ? params.resourceArn : error(`'resourceArn' string value required`),

    // Load optional database
    database:
      typeof params.database === 'string'
        ? params.database
        : params.database !== undefined
        ? error(`'database' must be a string`)
        : undefined,

    // Load optional schema DISABLED for now since this isn't used with MySQL
    // schema: typeof params.schema === 'string' ? params.schema
    //   : params.schema !== undefined ? error(`'schema' must be a string`)
    //   : undefined,

    // Set hydrateColumnNames (default to true)
    hydrateColumnNames: typeof params.hydrateColumnNames === 'boolean' ? params.hydrateColumnNames : true,

    // Value formatting options. For date the deserialization is enabled and (re)stored as UTC
    formatOptions: {
      deserializeDate:
        typeof params.formatOptions === 'object' && params.formatOptions.deserializeDate === false ? false : true,
      treatAsLocalDate: typeof params.formatOptions === 'object' && params.formatOptions.treatAsLocalDate
    },

    // TODO: Put this in a separate module for testing?
    // Create an instance of RDSDataService
    RDS: params.AWS ? new params.AWS.RDSDataService(options) : new awsSdk.RDSDataService(options)
  }; // end config

  // Return public methods
  return {
    // Query method, pass config and parameters
    query: (...x) => query(config, ...x),
    // Transaction method, pass config and parameters
    transaction: (x) => transaction(config, x),

    // Export promisified versions of the RDSDataService methods
    batchExecuteStatement: (args) =>
      config.RDS.batchExecuteStatement(
        mergeConfig(pick(config, ['resourceArn', 'secretArn', 'database']), args)
      ).promise(),
    beginTransaction: (args) =>
      config.RDS.beginTransaction(mergeConfig(pick(config, ['resourceArn', 'secretArn', 'database']), args)).promise(),
    commitTransaction: (args) =>
      config.RDS.commitTransaction(mergeConfig(pick(config, ['resourceArn', 'secretArn']), args)).promise(),
    executeStatement: (args) =>
      config.RDS.executeStatement(mergeConfig(pick(config, ['resourceArn', 'secretArn', 'database']), args)).promise(),
    rollbackTransaction: (args) =>
      config.RDS.rollbackTransaction(mergeConfig(pick(config, ['resourceArn', 'secretArn']), args)).promise()
  }
}; // end exports

var dataApiClient = init;

var pad = function (val, num) {
    if (num === void 0) { num = 2; }
    return '0'.repeat(num - (val.toString()).length) + val;
};
var dateToDateTimeString = function (date) {
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1; // Convert to human month
    var day = date.getUTCDate();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    var ms = date.getUTCMilliseconds();
    var fraction = ms <= 0 ? '' : "." + pad(ms, 3);
    return year + "-" + pad(month) + "-" + pad(day) + " " + pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + fraction;
};
var dateToDateString = function (date) {
    if (typeof date === 'string') {
        return date;
    }
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1; // Convert to human month
    var day = date.getUTCDate();
    return year + "-" + pad(month) + "-" + pad(day);
};
var dateToTimeString = function (date) {
    if (typeof date === 'string') {
        return date;
    }
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    var seconds = date.getUTCSeconds();
    var ms = date.getUTCMilliseconds();
    var fraction = ms <= 0 ? '' : "." + pad(ms, 3);
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds) + fraction;
};
var simpleArrayToString = function (value) {
    if (Array.isArray(value)) {
        return value
            .map(function (i) { return String(i); })
            .join(',');
    }
    return value;
};
var stringToSimpleArray = function (value) {
    if (value instanceof String || typeof value === 'string') {
        if (value.length > 0) {
            return value.split(',');
        }
        return [];
    }
    return value;
};
var getDecimalCast = function (_a) {
    var precision = _a.precision, scale = _a.scale;
    if (!precision)
        return 'DECIMAL';
    if (!scale)
        return "DECIMAL(" + precision + ")";
    return "DECIMAL(" + precision + "," + scale + ")";
};

var QueryTransformer = /** @class */ (function () {
    function QueryTransformer(transformOptions) {
        this.transformOptions = transformOptions;
    }
    QueryTransformer.prototype.transformQueryAndParameters = function (query, srcParameters) {
        if (srcParameters === void 0) { srcParameters = []; }
        if (!srcParameters.length) {
            return { queryString: query, parameters: [] };
        }
        var queryString = this.transformQuery(query, srcParameters);
        var parameters = this.transformParameters(srcParameters);
        return { queryString: queryString, parameters: parameters };
    };
    return QueryTransformer;
}());

var MysqlQueryTransformer = /** @class */ (function (_super) {
    __extends(MysqlQueryTransformer, _super);
    function MysqlQueryTransformer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MysqlQueryTransformer.prototype.preparePersistentValue = function (value, metadata) {
        if (!value) {
            return value;
        }
        switch (metadata.type) {
            case 'date':
                return {
                    value: dateToDateString(value),
                    cast: 'DATE',
                };
            case 'time':
                return {
                    value: dateToTimeString(value),
                    cast: 'TIME',
                };
            case 'timestamp':
            case 'datetime':
            case Date:
                return {
                    value: dateToDateTimeString(value),
                    cast: 'DATETIME',
                };
            case 'decimal':
            case 'numeric':
                return {
                    value: '' + value,
                    cast: getDecimalCast(metadata),
                };
            case 'set':
            case 'simple-array':
                return {
                    value: simpleArrayToString(value),
                };
            case 'json':
            case 'simple-json':
                return {
                    value: JSON.stringify(value),
                };
            case 'enum':
            case 'simple-enum':
                return {
                    value: '' + value,
                };
            default:
                return {
                    value: value,
                };
        }
    };
    MysqlQueryTransformer.prototype.prepareHydratedValue = function (value, metadata) {
        if (value === null || value === undefined) {
            return value;
        }
        switch (metadata.type) {
            case Boolean:
                return !!value;
            case 'datetime':
            case Date:
            case 'timestamp':
            case 'timestamp with time zone':
            case 'timestamp without time zone':
                return typeof value === 'string' ? new Date(value + ' GMT+0') : value;
            case 'date':
                return dateToDateString(value);
            case 'year':
                return typeof value === 'string' ? new Date(value).getUTCFullYear() : value.getUTCFullYear();
            case 'time':
                return value;
            case 'set':
            case 'simple-array':
                return typeof value === 'string' ? stringToSimpleArray(value) : value;
            case 'json':
            case 'simple-json':
                return typeof value === 'string' ? JSON.parse(value) : value;
            case 'enum':
            case 'simple-enum':
                if (metadata.enum && !Number.isNaN(value) && metadata.enum.indexOf(parseInt(value, 10)) >= 0) {
                    return parseInt(value, 10);
                }
                return value;
            default:
                return value;
        }
    };
    MysqlQueryTransformer.prototype.transformQuery = function (query, parameters) {
        var quoteCharacters = ["'", '"'];
        var newQueryString = '';
        var currentQuote = null;
        var srcIndex = 0;
        var destIndex = 0;
        for (var i = 0; i < query.length; i += 1) {
            var currentCharacter = query[i];
            var currentCharacterEscaped = i !== 0 && query[i - 1] === '\\';
            if (currentCharacter === '?' && !currentQuote) {
                var parameter = parameters[srcIndex];
                if (Array.isArray(parameter)) {
                    // eslint-disable-next-line no-loop-func
                    var additionalParameters = parameter.map(function (_, index) { return ":param_" + (destIndex + index); });
                    newQueryString += additionalParameters.join(', ');
                    destIndex += additionalParameters.length;
                }
                else {
                    newQueryString += ":param_" + destIndex;
                    destIndex += 1;
                }
                srcIndex += 1;
            }
            else {
                newQueryString += currentCharacter;
                if (quoteCharacters.includes(currentCharacter) && !currentCharacterEscaped) {
                    if (!currentQuote) {
                        currentQuote = currentCharacter;
                    }
                    else if (currentQuote === currentCharacter) {
                        currentQuote = null;
                    }
                }
            }
        }
        return newQueryString;
    };
    MysqlQueryTransformer.prototype.transformParameters = function (parameters) {
        if (!parameters) {
            return parameters;
        }
        var expandedParameters = this.expandArrayParameters(parameters);
        return expandedParameters.map(function (parameter, index) {
            if (parameter === undefined) {
                return parameter;
            }
            if (typeof parameter === 'object' && typeof (parameter === null || parameter === void 0 ? void 0 : parameter.value) !== 'undefined') {
                return (__assign({ name: "param_" + index }, parameter));
            }
            return {
                name: "param_" + index,
                value: parameter,
            };
        });
    };
    MysqlQueryTransformer.prototype.expandArrayParameters = function (parameters) {
        return parameters.reduce(function (expandedParameters, parameter) {
            if (Array.isArray(parameter)) {
                expandedParameters.push.apply(expandedParameters, parameter);
            }
            else {
                expandedParameters.push(parameter);
            }
            return expandedParameters;
        }, []);
    };
    return MysqlQueryTransformer;
}(QueryTransformer));

var PostgresQueryTransformer = /** @class */ (function (_super) {
    __extends(PostgresQueryTransformer, _super);
    function PostgresQueryTransformer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PostgresQueryTransformer.prototype.preparePersistentValue = function (value, metadata) {
        if (!value) {
            return value;
        }
        switch (metadata.type) {
            case "date":
                return {
                    value: dateToDateString(value),
                    cast: "DATE",
                };
            case "time":
                return {
                    value: dateToTimeString(value),
                    cast: "TIME",
                };
            case "time with time zone":
                return {
                    value: dateToTimeString(value),
                    cast: "time with time zone",
                };
            case "timetz":
                return {
                    value: dateToTimeString(value),
                    cast: "timetz",
                };
            case "interval":
                return {
                    value: value,
                    cast: "interval",
                };
            case "timestamp":
            case "datetime":
            case "timestamp with time zone":
            case "timestamptz":
                return {
                    value: dateToDateTimeString(new Date(value)),
                    cast: "TIMESTAMP",
                };
            case "decimal":
            case "numeric":
                return {
                    value: "" + value,
                    cast: getDecimalCast(metadata),
                };
            case "simple-array":
                return {
                    value: simpleArrayToString(value),
                };
            case "simple-json":
            case "json":
            case "jsonb":
                return {
                    value: JSON.stringify(value),
                    cast: "JSON",
                };
            case "uuid":
                return {
                    value: "" + value,
                    cast: "UUID",
                };
            case "simple-enum":
            case "enum":
                return {
                    value: "" + value,
                    cast: metadata.enumName ||
                        metadata.entityMetadata.tableName + "_" + metadata.databaseName.toLowerCase() + "_enum",
                };
            default:
                return {
                    value: value,
                };
        }
    };
    PostgresQueryTransformer.prototype.prepareHydratedValue = function (value, metadata) {
        if (value === null || value === undefined) {
            return value;
        }
        switch (metadata.type) {
            case Boolean:
                return !!value;
            case "datetime":
            case Date:
            case "timestamp":
            case "timestamp with time zone":
            case "timestamp without time zone":
            case "timestamptz":
                return typeof value === "string" ? new Date(value + " GMT+0") : value;
            case "date":
                return dateToDateString(value);
            case "time":
                return value;
            case "hstore":
                if (metadata.hstoreType === "object") {
                    var unescapeString_1 = function (str) { return str.replace(/\\./g, function (m) { return m[1]; }); };
                    var regexp = /"([^"\\]*(?:\\.[^"\\]*)*)"=>(?:(NULL)|"([^"\\]*(?:\\.[^"\\]*)*)")(?:,|$)/g;
                    var object_1 = {};
                    ("" + value).replace(regexp, function (_, key, nullValue, stringValue) {
                        object_1[unescapeString_1(key)] = nullValue ? null : unescapeString_1(stringValue);
                        return "";
                    });
                    return object_1;
                }
                return value;
            case "simple-array":
                return typeof value === "string" ? stringToSimpleArray(value) : value;
            case "json":
            case "simple-json":
            case "jsonb":
                return typeof value === "string" ? JSON.parse(value) : value;
            case "enum":
            case "simple-enum":
                if (metadata.isArray) {
                    // manually convert enum array to array of values (pg does not support, see https://github.com/brianc/node-pg-types/issues/56)
                    value =
                        value !== "{}"
                            ? value.substr(1, value.length - 2).split(",")
                            : [];
                    // convert to number if that exists in possible enum options
                    return value.map(function (val) {
                        return !Number.isNaN(+val) && metadata.enum.indexOf(parseInt(val, 10)) >= 0
                            ? parseInt(val, 10)
                            : val;
                    });
                }
                // convert to number if that exists in poosible enum options
                return !Number.isNaN(+value) && metadata.enum.indexOf(parseInt(value, 10)) >= 0
                    ? parseInt(value, 10)
                    : value;
            default:
                return value;
        }
    };
    PostgresQueryTransformer.prototype.transformQuery = function (query) {
        var quoteCharacters = ["'", '"'];
        var newQueryString = "";
        var currentQuote = null;
        for (var i = 0; i < query.length; i += 1) {
            var currentCharacter = query[i];
            var currentCharacterEscaped = i !== 0 && query[i - 1] === "\\";
            if (currentCharacter === "$" && !currentQuote) {
                newQueryString += ":param_";
            }
            else {
                newQueryString += currentCharacter;
                if (quoteCharacters.includes(currentCharacter) && !currentCharacterEscaped) {
                    if (!currentQuote) {
                        currentQuote = currentCharacter;
                    }
                    else if (currentQuote === currentCharacter) {
                        currentQuote = null;
                    }
                }
            }
        }
        return newQueryString;
    };
    PostgresQueryTransformer.prototype.transformParameters = function (parameters) {
        var _this = this;
        if (!parameters) {
            return parameters;
        }
        return parameters.map(function (parameter, index) {
            var _a;
            if (parameter === undefined) {
                return parameter;
            }
            if (typeof parameter === "object" && typeof (parameter === null || parameter === void 0 ? void 0 : parameter.value) !== "undefined") {
                return __assign({ name: "param_" + (index + 1) }, parameter);
            }
            // Hack for UUID
            if (((_a = _this.transformOptions) === null || _a === void 0 ? void 0 : _a.enableUuidHack) &&
                /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test("" + parameter)) {
                return {
                    name: "param_" + (index + 1),
                    value: "" + parameter,
                    cast: "uuid",
                };
            }
            return {
                name: "param_" + (index + 1),
                value: parameter,
            };
        });
    };
    return PostgresQueryTransformer;
}(QueryTransformer));

var DataApiDriver = /** @class */ (function () {
    function DataApiDriver(region, secretArn, resourceArn, database, loggerFn, queryTransformer, serviceConfigOptions, formatOptions, queryConfigOptions) {
        if (loggerFn === void 0) { loggerFn = function () { return undefined; }; }
        this.region = region;
        this.secretArn = secretArn;
        this.resourceArn = resourceArn;
        this.database = database;
        this.loggerFn = loggerFn;
        this.queryTransformer = queryTransformer;
        this.serviceConfigOptions = serviceConfigOptions;
        this.formatOptions = formatOptions;
        this.queryConfigOptions = queryConfigOptions;
        this.region = region;
        this.secretArn = secretArn;
        this.resourceArn = resourceArn;
        this.database = database;
        this.loggerFn = loggerFn;
        this.serviceConfigOptions = serviceConfigOptions || {};
        this.serviceConfigOptions.region = region;
        this.client = dataApiClient({
            secretArn: secretArn,
            resourceArn: resourceArn,
            database: database,
            options: this.serviceConfigOptions,
            formatOptions: formatOptions,
        });
        this.queryTransformer = queryTransformer;
        this.queryConfigOptions = serviceConfigOptions === null || serviceConfigOptions === void 0 ? void 0 : serviceConfigOptions.queryConfigOptions;
    }
    DataApiDriver.prototype.query = function (query, parameters) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var transformedQueryData, result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        transformedQueryData = this.queryTransformer.transformQueryAndParameters(query, parameters);
                        this.loggerFn(transformedQueryData.queryString, transformedQueryData.parameters);
                        return [4 /*yield*/, this.client.query({
                                sql: transformedQueryData.queryString,
                                parameters: transformedQueryData.parameters,
                                transactionId: this.transactionId,
                                continueAfterTimeout: (_b = (_a = this.queryConfigOptions) === null || _a === void 0 ? void 0 : _a.continueAfterTimeout) !== null && _b !== void 0 ? _b : false,
                            })
                            // TODO: Remove this hack when all Postgres calls in TypeORM use structured result
                        ];
                    case 1:
                        result = _c.sent();
                        // TODO: Remove this hack when all Postgres calls in TypeORM use structured result
                        if (result.records) {
                            result = result.records;
                            result.records = result;
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    DataApiDriver.prototype.preparePersistentValue = function (value, columnMetadata) {
        return this.queryTransformer.preparePersistentValue(value, columnMetadata);
    };
    DataApiDriver.prototype.prepareHydratedValue = function (value, columnMetadata) {
        return this.queryTransformer.prepareHydratedValue(value, columnMetadata);
    };
    DataApiDriver.prototype.startTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var transactionId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.beginTransaction()];
                    case 1:
                        transactionId = (_a.sent()).transactionId;
                        this.transactionId = transactionId;
                        return [2 /*return*/];
                }
            });
        });
    };
    DataApiDriver.prototype.commitTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.commitTransaction({ transactionId: this.transactionId })];
                    case 1:
                        _a.sent();
                        this.transactionId = undefined;
                        return [2 /*return*/];
                }
            });
        });
    };
    DataApiDriver.prototype.rollbackTransaction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rollbackTransaction({ transactionId: this.transactionId })];
                    case 1:
                        _a.sent();
                        this.transactionId = undefined;
                        return [2 /*return*/];
                }
            });
        });
    };
    return DataApiDriver;
}());
var createMysqlDriver = function (region, secretArn, resourceArn, database, loggerFn, serviceConfigOptions, formatOptions) {
    if (loggerFn === void 0) { loggerFn = function () { return undefined; }; }
    return new DataApiDriver(region, secretArn, resourceArn, database, loggerFn, new MysqlQueryTransformer({ enableUuidHack: formatOptions === null || formatOptions === void 0 ? void 0 : formatOptions.enableUuidHack }), serviceConfigOptions, formatOptions);
};
var createPostgresDriver = function (region, secretArn, resourceArn, database, loggerFn, serviceConfigOptions, formatOptions) {
    if (loggerFn === void 0) { loggerFn = function () { return undefined; }; }
    return new DataApiDriver(region, secretArn, resourceArn, database, loggerFn, new PostgresQueryTransformer({ enableUuidHack: formatOptions === null || formatOptions === void 0 ? void 0 : formatOptions.enableUuidHack }), serviceConfigOptions, formatOptions);
};
var pg = createPostgresDriver;

export default createMysqlDriver;
export { pg, MysqlQueryTransformer, PostgresQueryTransformer };
//# sourceMappingURL=typeorm-aurora-data-api-driver.es5.js.map
