# NBFX.js
MC-NBFX parser written in TypeScript

Rudimentary JavaScript parser for SOAP messages transmitted in .NET Binary. Based on Microsoft Open Specifications Documentation documents: MC-NBFX (6.0), MC-NBFS (4.0).

Try it at: https://nya.nz/nbfx

Wrote this over 5 days in TypeScript around the New Year 2016 period; I was working with a project that ported an WCF consuming application that talked to a server configured to communicate SOAP messages only in NBFX binary format. I stopped because we decided it was probably better to just reconfigure the server to use text XML that could be fed into a browser's native DOM/XML parser.

Code's a bit crummy inside but it works surprisingly robustly with a couple hundred KB of raw data (though the unoptimised JS is slow with such large inputs...) I thought it might be of interest to someone in the same position as I was in porting applications using WCF in the NBFX format.

## Notes
* Records requiring 64-bit integers (Int64Text, UInt64Text) or such integers internally (DateTimeText, TimeSpanText) are not yet implemented due to lack of native int64 support in JavaScript
* DecimalText, StartListText, EndListText, Comment, Array record support are not yet implemented
* Generated XML document does not have namespace information attached to elements - information inserted into tag names and attributes is *not* done with *NS methods
* Spec documentation has a few errors/problems especially around the reference examples, so implementation may not work correctly with all raw data
