import { useMemo, useState } from 'react'
import { agents, cities, listings } from './data.js'
import iconMark from '../Findam Icon.jpg.jpeg'
import fullLogo from '../Findam Logo.jpg.jpeg'
import wordmarkLogo from '../Findam Only .jpg.jpeg'
import beautifulHouse from '../Findam pic(1).jpeg'

const money = (value) => `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value / 1000)}k FCFA`

function Logo() {
  return <img src={fullLogo} alt="Findam — Expertise you can trust, results you'll love" className="brand-logo" style={{ maxWidth: '200px', height: 'auto' }} />
}

function FooterLogo() {
  return <span className="logo-mark"><img src={iconMark} alt="" className="logo-icon" />Findam</span>
}

function ListingCard({ listing, onOpen, saved, onSave }) {
  return <article className="listing-card" onClick={() => onOpen(listing)} role="button" tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && onOpen(listing)}>
    <div className="listing-image" style={{ '--hue': listing.hue }}>
      <span className="badge">Verified</span><button className={`heart ${saved ? 'saved' : ''}`} onClick={(event) => { event.stopPropagation(); onSave(listing.id) }} aria-label="Save property">{saved ? '♥' : '♡'}</button><span className="property-icon">⌂</span>
    </div>
    <div className="listing-copy">
      <h3>{listing.title}</h3><p>{listing.neighbourhood}, {listing.city}</p>
      <strong>{money(listing.price)}{listing.period !== 'sale' && ` / ${listing.period}`}</strong>
      <div className="meta"><span>▱ {listing.beds} Beds</span><span>♧ {listing.baths} Baths</span><span>□ {listing.size} m²</span></div>
    </div>
  </article>
}

function SearchFields({ city, setCity, type, setType }) {
  return <>
    <label><span>Where are you looking?</span><select value={city} onChange={(e) => setCity(e.target.value)}><option value="">Any city</option>{cities.map((item) => <option key={item}>{item}</option>)}</select></label>
    <label><span>Property type</span><select value={type} onChange={(e) => setType(e.target.value)}><option value="">Any</option><option>Rent</option><option>Short Let</option></select></label>
  </>
}

function App() {
  const [page, setPage] = useState('home')
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [maxPrice, setMaxPrice] = useState('')
  const [savedIds, setSavedIds] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const results = useMemo(() => listings.filter((listing) => (!city || listing.city === city) && (!type || listing.type === type) && (!maxPrice || listing.price <= Number(maxPrice) * 1000) && `${listing.title} ${listing.city} ${listing.neighbourhood}`.toLowerCase().includes(query.toLowerCase())), [city, type, query, maxPrice])
  const go = (next) => { setPage(next); setSelected(null); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const showListing = (listing) => { setSelected(listing); go('detail') }
  const chooseType = (choice) => { setType(choice); go('listings') }
  const toggleSaved = (id) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])

  return <>
    <header><div className="nav shell">
      <button className="brand" onClick={() => go('home')}><Logo /></button>
      <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">☰</button>
      <nav className={menuOpen ? 'open' : ''}>
        <button className={page === 'home' ? 'active' : ''} onClick={() => go('home')}>Home</button><button onClick={() => chooseType('Rent')}>Rent</button><button onClick={() => chooseType('Short Let')}>Short Let</button><button onClick={() => go('agents')}>Find Agents</button><button onClick={() => go('workflow')}>How it works</button>
      </nav>
      <button className="primary compact" onClick={() => go('list')}>List Your Property</button><button className="account" onClick={() => go('saved')} aria-label="Saved properties">♥</button>
    </div></header>
    <main>
      {page === 'home' && <Home city={city} setCity={setCity} type={type} setType={setType} maxPrice={maxPrice} setMaxPrice={setMaxPrice} search={() => go('listings')} onOpen={showListing} savedIds={savedIds} onSave={toggleSaved} go={go} />}
      {page === 'listings' && <Listings results={results} city={city} setCity={setCity} type={type} setType={setType} maxPrice={maxPrice} setMaxPrice={setMaxPrice} query={query} setQuery={setQuery} onOpen={showListing} savedIds={savedIds} onSave={toggleSaved} />}
      {page === 'detail' && <Detail listing={selected} back={() => go('listings')} />}
      {page === 'agents' && <Agents />}
      {page === 'list' && <ListProperty />}
      {page === 'workflow' && <Workflow go={go} />}
      {page === 'saved' && <Saved listings={listings.filter((listing) => savedIds.includes(listing.id))} onOpen={showListing} savedIds={savedIds} onSave={toggleSaved} go={go} />}
    </main>
    <HelpBot go={go} chooseType={chooseType} />
    <footer><div className="shell footer"><div><FooterLogo /><p>Find verified properties. Move in with confidence.</p></div><div><b>Explore</b><button onClick={() => chooseType('Rent')}>Rent a home</button><button onClick={() => go('agents')}>Find an agent</button></div><div><b>Available cities</b>{cities.map((item) => <span key={item}>{item}</span>)}</div></div></footer>
  </>
}

function Home({ city, setCity, type, setType, maxPrice, setMaxPrice, search, onOpen, savedIds, onSave, go }) { return <>
  <section className="hero"><div className="shell hero-grid"><div className="hero-copy">
    <h1>Find Verified Properties.<br />Move in with <em>Confidence.</em></h1><p>Findam connects house seekers, landlords, civil engineers and agents on one trusted platform.</p>
    <div className="type-tabs"><button className={!type || type === 'Rent' ? 'selected' : ''} onClick={() => setType('Rent')}>For Rent</button><button className={type === 'Short Let' ? 'selected' : ''} onClick={() => setType('Short Let')}>Short Let</button></div>
    <form className="search-bar" onSubmit={(event) => { event.preventDefault(); search() }}><SearchFields {...{ city, setCity, type, setType }} /><label><span>Max price (thousand FCFA)</span><input type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="e.g. 150" /></label><button className="primary">⌕ Search</button></form>
    <div className="trust-strip"><Trust icon="♢" title="Verified Listings" text="Agent visited & engineer inspected" /><Trust icon="♙" title="Trusted Agents" text="On-ground support you can rely on" /><Trust icon="♙" title="Safe & Secure" text="Properties verified before publishing" /><Trust icon="▣" title="Easy Access" text="App, WhatsApp Bot & website" /></div>
  </div>
  <div className="hero-visual"><div className="hero-panel" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><img src={beautifulHouse} alt="Beautiful house" className="hero-watermark" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', filter: 'saturate(1.15) contrast(1.06) brightness(1.05)', transform: 'scale(1.04)' }} /><div className="hero-city-stack"><span className="city-pill">Bamenda</span><span className="city-pill offset">Buea</span><span className="city-pill">Yaounde</span></div></div><div className="verified-float">✓ <span>Agent visited<br />Engineer reviewed</span></div><div className="stat-float"><b>120+</b><span>Verified homes</span></div></div></div></section>
  <section className="shell featured section"><div className="section-head"><h2>Featured Verified Listings</h2><button className="text-button" onClick={() => go('listings')}>View all listings →</button></div><div className="cards">{listings.filter((item) => item.featured).map((item) => <ListingCard key={item.id} listing={item} onOpen={onOpen} saved={savedIds.includes(item.id)} onSave={onSave} />)}</div></section>
  <section className="shell role-section"><Role icon="⌂" title="I'm a Landlord" text="List your property and get serious tenants faster." action="List Property" onClick={() => go('list')} /><Role icon="⌕" title="I'm a House Seeker" text="Find verified properties that match your needs." action="Start Searching" onClick={() => go('listings')} /><Role icon="♙" title="I'm an Agent" text="Join our network of trusted house finders." action="Become an Agent" onClick={() => go('agents')} /></section>
  <section className="workflow-preview"><div className="shell"><p className="kicker">HOW FINDAM WORKS</p><h2>Verified from visit to move-in.</h2><div className="steps"><Step number="1" title="Search" text="Find a home by city, budget and type." /><Step number="2" title="Browse verified" text="Only inspected properties appear publicly." /><Step number="3" title="Contact agent" text="Connect with the assigned house finder." /><Step number="4" title="Schedule viewing" text="Choose a time to see the home." /><Step number="5" title="Move in" text="Your agent supports the handover." /></div></div></section>
  </> }

function Trust({ icon, title, text }) { return <div className="trust"><i>{icon}</i><span><b>{title}</b><small>{text}</small></span></div> }
function Role({ icon, title, text, action, onClick }) { return <article className="role"><i>{icon}</i><div><h3>{title}</h3><p>{text}</p><button onClick={onClick}>{action} →</button></div></article> }
function Step({ number, title, text }) { return <article><b>{number}</b><h3>{title}</h3><p>{text}</p></article> }

function Listings({ results, city, setCity, type, setType, maxPrice, setMaxPrice, query, setQuery, onOpen, savedIds, onSave }) { return <section className="shell section"><p className="kicker">VERIFIED LISTINGS</p><h1 className="page-title">Find your next home</h1><div className="filters"><SearchFields {...{ city, setCity, type, setType }} /><label><span>Max price (thousand FCFA)</span><input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="e.g. 150" /></label><label><span>Search location or property</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. Molyko" /></label></div><p className="result-count">{results.length} verified {results.length === 1 ? 'property' : 'properties'} found</p><div className="cards">{results.map((item) => <ListingCard key={item.id} listing={item} onOpen={onOpen} saved={savedIds.includes(item.id)} onSave={onSave} />)}</div>{!results.length && <div className="empty">No properties match these filters. Try another city or property type.</div>}</section> }
function Detail({ listing, back }) { if (!listing) return null; return <section className="shell section"><button className="text-button" onClick={back}>← Back to listings</button><div className="detail"><div><div className="detail-image" style={{ '--hue': listing.hue }}><span className="badge">Verified</span><span className="property-icon">⌂</span></div><p className="kicker">{listing.type} · {listing.city}</p><h1 className="page-title">{listing.title}</h1><p className="lead">{listing.description}</p><div className="facts"><span>{listing.beds} Bedrooms</span><span>{listing.baths} Bathrooms</span><span>{listing.size} m²</span></div></div><aside><p className="kicker">PRICE</p><h2>{money(listing.price)}</h2><p>per {listing.period}</p><button className="primary">Contact assigned agent</button><div className="verified">✓ Agent visit and engineer inspection complete.</div></aside></div></section> }
function Agents() { return <section className="shell section"><p className="kicker">HOUSE FINDERS</p><h1 className="page-title">Meet Findam agents</h1><p className="lead">Local representatives who verify properties, arrange viewings and support your move.</p><div className="agent-grid">{agents.map((agent) => <article className="agent" key={agent.name}><div className="avatar">{agent.initials}</div><h3>{agent.name}</h3><p>{agent.city}</p><strong>★ {agent.rating}</strong><span>{agent.closed} successful moves</span><button className="secondary">Contact agent</button></article>)}</div></section> }
function ListProperty() { const [sent, setSent] = useState(false); const [city, setCity] = useState(''); const [type, setType] = useState('Rent'); const [photos, setPhotos] = useState([]); const addPhotos = (event) => { if (event.target.files && event.target.files.length > 0) { const newPhotos = Array.from(event.target.files).slice(0, 6).map((file) => ({ name: file.name, url: URL.createObjectURL(file) })); setPhotos(newPhotos); } }; return <section className="shell section"><div className="form-wrap"><p className="kicker">LANDLORD PORTAL</p><h1 className="page-title">List your property</h1><p className="lead">Submit your details and photos. A house finder visits first, then a civil engineer completes the verification before publishing.</p>{sent ? <div className="success"><img src={wordmarkLogo} alt="Findam" className="success-logo" /><h2>Submission received</h2><p>We will contact you to schedule the property visit and inspection.</p></div> : <form className="property-form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}><label>Property title<input required placeholder="e.g. 2 Bedroom Apartment" /></label><SearchFields {...{ city, setCity, type, setType }} /><label>Price (thousand FCFA)<input required type="number" min="1" placeholder="e.g. 150" /><small>Enter 150 for 150,000 FCFA.</small></label><label>Phone number<input required type="tel" placeholder="+237" /></label><label className="photo-upload">Property photos<input type="file" accept="image/*" multiple onChange={addPhotos} /><span>Upload up to 6 photos of rooms or the building</span></label>{photos.length > 0 && <div className="photo-previews">{photos.map((photo) => <img src={photo.url} alt={photo.name} key={photo.url} />)}</div>}<button className="primary">Submit for verification</button></form>}</div></section> }
function Workflow({ go }) { return <section className="shell section"><p className="kicker">THE FINDAM WORKFLOW</p><h1 className="page-title">One trusted workflow for every listing.</h1><div className="workflow-grid"><article><span>01</span><h2>Landlord submits</h2><p>Property details, photos and price are shared through the website, app or an agent.</p></article><article><span>02</span><h2>Agent visits</h2><p>A house finder confirms information on-site and captures final details.</p></article><article><span>03</span><h2>Engineer inspects</h2><p>A civil engineer checks structural safety and condition.</p></article><article><span>04</span><h2>Published</h2><p>The verified property becomes visible on the website, app and WhatsApp bot.</p></article></div><div className="bot-callout"><div><p className="kicker">WHATSAPP BOT</p><h2>Low-data access to Findam.</h2><p>Search properties, list a home or request a handoff to a local agent without installing an app.</p></div><a className="primary" href="https://wa.me/237600000000" target="_blank" rel="noreferrer">Chat on WhatsApp</a></div><button className="primary" onClick={() => go('list')}>List a property</button></section> }

function Saved({ listings, onOpen, savedIds, onSave, go }) { return <section className="shell section"><p className="kicker">YOUR SHORTLIST</p><h1 className="page-title">Saved properties</h1>{listings.length ? <div className="cards saved-grid">{listings.map((listing) => <ListingCard key={listing.id} listing={listing} onOpen={onOpen} saved={savedIds.includes(listing.id)} onSave={onSave} />)}</div> : <div className="empty">You have not saved any properties yet.<br /><button className="primary" onClick={() => go('listings')}>Browse verified listings</button></div>}</section> }

function HelpBot({ go, chooseType }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! I am Findam Bot. Ask about homes, prices, verification or listing a property.' }])
  const botReply = (text) => {
    const value = text.toLowerCase()
    if (value.includes('verify') || value.includes('safe')) return 'Every public listing is visited by a Findam house finder and reviewed by a civil engineer before it is published.'
    if (value.includes('price') || value.includes('cost') || value.includes('rent')) return 'All prices are shown in thousands of FCFA. For example, 150k FCFA means 150,000 FCFA.'
    if (value.includes('list') || value.includes('landlord') || value.includes('photo')) return 'To list a property, submit its title, city, price and room or building photos. We then arrange the agent visit and inspection.'
    if (value.includes('city') || value.includes('location')) return 'Findam currently covers Bamenda, Buea and Yaounde. You can filter listings by city from the search bar.'
    if (value.includes('agent') || value.includes('contact')) return 'I can help you find a property first, or you can use the contact options below to speak with Findam directly.'
    return 'I can help with finding a home, listing a property, prices, verification, cities and agents. Could you tell me a little more?'
  }
  const sendMessage = (event) => { event.preventDefault(); const text = message.trim(); if (!text) return; setMessages((current) => [...current, { from: 'user', text }, { from: 'bot', text: botReply(text) }]); setMessage('') }
  const quickReply = (text) => setMessages((current) => [...current, { from: 'user', text }, { from: 'bot', text: botReply(text) }])
  return <div className="bot-widget">
    {open && <section className="bot-panel"><header><span className="bot-logo">🤖</span><div><b>Findam Bot</b><small>Online · replies instantly</small></div><button onClick={() => setOpen(false)} aria-label="Close help">×</button></header><div className="bot-chat">{messages.map((item, index) => <p className={item.from} key={`${item.from}-${index}`}>{item.text}</p>)}</div><form className="bot-input" onSubmit={sendMessage}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message..." aria-label="Message Findam Bot" /><button type="submit" aria-label="Send message">➤</button></form><div className="bot-actions"><button onClick={() => quickReply('How are listings verified?')}>Verification</button><button onClick={() => quickReply('How do prices work?')}>Prices</button><button onClick={() => { chooseType('Rent'); setOpen(false) }}>Find a home</button><button onClick={() => { go('list'); setOpen(false) }}>List a property</button></div><div className="bot-contact"><b>Contact Findam directly</b><a href="tel:+237600000000">☎ +237 600 000 000</a><a href="https://wa.me/237600000000?text=Hi%20Findam%2C%20I%20need%20help" target="_blank" rel="noreferrer">◔ WhatsApp Findam</a></div></section>}
    <button className="whatsapp" onClick={() => setOpen(!open)} aria-label="Open Findam Bot"><span className="floating-bot">🤖</span><span>Findam Bot</span></button>
  </div>
}

function ContactWidget() {
  return <div className="contact-widget" aria-hidden="false">
    <a className="contact-pill phone" href="tel:+237600000000">☎ +237 600 000 000</a>
    <a className="contact-pill wa" href="https://wa.me/237600000000?text=Hi%20Findam%2C%20I%20need%20help" target="_blank" rel="noreferrer">WhatsApp</a>
  </div>
}

export default App

// render ContactWidget from App root (added to DOM in App layout)
