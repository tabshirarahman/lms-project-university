import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">About LMS Platform</h1>
        <p className="text-lg text-muted-foreground">Empowering education through technology and innovation</p>
      </section>

      {/* Mission Vision */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To provide educational institutions with a comprehensive, user-friendly learning management system that
              simplifies course delivery, result tracking, and student engagement while maintaining the highest
              standards of security and reliability.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To transform education globally by creating an inclusive digital platform that enables seamless
              collaboration between educators and students, fostering innovation and excellence in learning outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-card border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Our Core Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["Innovation", "Reliability", "Accessibility", "Security"].map((value) => (
              <Card key={value} className="p-6 text-center">
                <h3 className="font-bold text-foreground mb-2">{value}</h3>
                <p className="text-sm text-muted-foreground">
                  We constantly innovate to provide cutting-edge solutions that drive educational success.
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Our Team</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Built by passionate educators and engineers dedicated to transforming the educational landscape through
          technology.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Education Director", "CTO", "Product Lead"].map((role) => (
            <Card key={role} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4"></div>
              <h3 className="font-bold text-foreground">Team Member</h3>
              <p className="text-sm text-muted-foreground">{role}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
